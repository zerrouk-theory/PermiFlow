"""
Nightly job: load latest permits from Supabase, score with XGBoost, push back.
"""

import os
from pathlib import Path

import numpy as np
import pandas as pd
import xgboost as xgb
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
MODEL_PATH = Path(os.getenv("PERMIFLOW_MODEL", "models/hype_score.json"))


def fetch_permits():
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise EnvironmentError("Supabase credentials missing.")
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    response = client.table("towns").select(
        "id, iris_code, name, permits, score"
    ).execute()
    return pd.DataFrame(response.data or [])


def build_matrix(df: pd.DataFrame):
    if df.empty:
        return xgb.DMatrix(np.zeros((0, 4)))
    features = df[["permits", "score"]].copy()
    features["permits_log"] = np.log1p(features["permits"])
    features["score_norm"] = features["score"] / 100
    return xgb.DMatrix(features)


def main():
    if not MODEL_PATH.exists():
        raise FileNotFoundError("Model file missing, run train_score.py first.")

    booster = xgb.Booster()
    booster.load_model(MODEL_PATH)

    permits = fetch_permits()
    matrix = build_matrix(permits)
    predictions = booster.predict(matrix)
    permits["predicted_score"] = np.clip(predictions, 0, 100).round().astype(int)

    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    updates = [
        {
            "id": row["id"],
            "score": int(row["predicted_score"]),
        }
        for _, row in permits.iterrows()
    ]
    if updates:
        client.table("towns").upsert(updates).execute()
        print(f"Updated {len(updates)} towns.")
    else:
        print("No towns to update.")


if __name__ == "__main__":
    main()
