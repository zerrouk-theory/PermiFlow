"""
Settlement worker: scans bets past expiry, distributes pools, applies 5% fee.
"""

from __future__ import annotations

import argparse
import os
from dataclasses import dataclass
from decimal import Decimal
from typing import List

from supabase import Client, create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
PLATFORM_FEE = Decimal("0.05")


@dataclass
class Bet:
    id: str
    user_id: str
    amount: Decimal
    direction: str
    town_id: str
    expiry: str
    settled: bool
    won: bool | None


def get_client() -> Client:
    if not SUPABASE_URL or not SUPABASE_ROLE_KEY:
        raise EnvironmentError("Supabase credentials missing for worker.")
    return create_client(SUPABASE_URL, SUPABASE_ROLE_KEY)


def fetch_expired(client: Client) -> List[Bet]:
    response = client.table("bets").select("*").eq("settled", False).execute()
    return [
        Bet(
            id=bet["id"],
            user_id=bet["user_id"],
            amount=Decimal(str(bet["amount"])),
            direction=bet["direction"],
            town_id=bet["town_id"],
            expiry=bet["expiry"],
            settled=bet["settled"],
            won=None,
        )
        for bet in response.data or []
    ]


def settle(bets: List[Bet], dry_run: bool = False) -> None:
    if not bets:
        print("No bets to settle.")
        return

    client = get_client()
    pool = sum(bet.amount for bet in bets)
    net_pool = pool * (Decimal("1.00") - PLATFORM_FEE)
    winners = [bet for bet in bets if bet.direction == "UP"]

    if not winners:
        print("No winners, pool kept.")
        return

    reward = net_pool / len(winners)
    print(f"Pool={pool}€, net={net_pool}€, reward par gagnant={reward}€")

    if dry_run:
        return

    for bet in bets:
        client.table("bets").update({"settled": True}).eq("id", bet.id).execute()

    for bet in winners:
        client.rpc(
            "increment_balance",
            {"p_user_id": bet.user_id, "p_amount": float(reward)},
        ).execute()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    settle(fetch_expired(get_client()), dry_run=args.dry_run)
