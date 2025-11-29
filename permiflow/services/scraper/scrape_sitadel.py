import argparse
import io
import os
from datetime import datetime
from typing import List

import pandas as pd
import requests
from supabase import Client, create_client

DATASET_URL = os.getenv(
    "SITADEL_DATA_URL",
    "https://www.data.gouv.fr/fr/datasets/r/4f72c04c-13f1-4a8c-9442-692e8a54915c",
)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")


def fetch_csv() -> pd.DataFrame:
    response = requests.get(DATASET_URL, timeout=60)
    response.raise_for_status()
    buffer = io.BytesIO(response.content)
    return pd.read_csv(buffer, sep=";")


def aggregate(df: pd.DataFrame) -> pd.DataFrame:
    iris_col = next((col for col in df.columns if "IRIS" in col.upper()), "IRIS")
    commune_col = next(
        (col for col in df.columns if "COMMUNE" in col.upper()), "COMMUNE"
    )

    grouped = (
        df.groupby([iris_col, commune_col])
        .size()
        .reset_index(name="permits")
        .rename(
            columns={
                iris_col: "iris_code",
                commune_col: "name",
            }
        )
    )
    grouped["score"] = (
        grouped["permits"] / grouped["permits"].max() * 100
    ).clip(0, 100)
    grouped["score"] = grouped["score"].round().astype(int)
    grouped["updated_at"] = datetime.utcnow().isoformat()
    return grouped


def upsert_supabase(client: Client, rows: List[dict], dry_run: bool = False) -> None:
    if dry_run:
        print(f"[dry-run] {len(rows)} lignes prêtes à être insérées.")
        return

    chunk_size = 500
    for index in range(0, len(rows), chunk_size):
        chunk = rows[index : index + chunk_size]
        response = client.table("towns").upsert(chunk).execute()
        if response.data is None:
            raise RuntimeError(f"Supabase error on chunk {index}")


def main(dry_run: bool = False):
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise EnvironmentError("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis.")

    print("Téléchargement CSV SITADEL…")
    df = fetch_csv()
    aggregated = aggregate(df)
    rows = aggregated.to_dict(orient="records")

    print(f"{len(rows)} IRIS agrégés. Envoi vers Supabase…")
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    upsert_supabase(client, rows, dry_run=dry_run)
    print("Terminé ✔️")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scraper PermiFlow (SITADEL)")
    parser.add_argument("--dry-run", action="store_true", help="Sans écriture Supabase")
    args = parser.parse_args()
    main(dry_run=args.dry_run)
