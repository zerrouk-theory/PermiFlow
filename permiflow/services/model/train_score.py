"""
Train an XGBoost model that predicts a hype score for every commune / IRIS.
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path

import pandas as pd
import xgboost as xgb
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

DATASET_PATH = Path(os.getenv("PERMIFLOW_DATA", "data/permis_historique.csv"))
MODEL_PATH = Path(os.getenv("PERMIFLOW_MODEL", "models/hype_score.json"))


def build_features(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    features = df[
        [
            "nb_permis_6m",
            "nb_permis_12m",
            "nb_permis_24m",
            "montant_median",
            "population",
            "revenu_median",
        ]
    ].fillna(0)
    target = df["hype_score_future"]
    return features, target


def train(force: bool = False) -> None:
    if not DATASET_PATH.exists():
        raise FileNotFoundError(
            f"Dataset manquant ({DATASET_PATH}). Fournissez un CSV avec les colonnes attendues."
        )

    df = pd.read_csv(DATASET_PATH)
    X, y = build_features(df)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    params = {
        "max_depth": 4,
        "eta": 0.1,
        "subsample": 0.8,
        "colsample_bytree": 0.9,
        "objective": "reg:squarederror",
    }

    train_set = xgb.DMatrix(X_train, label=y_train)
    eval_set = xgb.DMatrix(X_test, label=y_test)
    booster = xgb.train(
        params,
        train_set,
        evals=[(train_set, "train"), (eval_set, "eval")],
        num_boost_round=250,
        verbose_eval=50,
    )

    predictions = booster.predict(eval_set)
    mae = mean_absolute_error(y_test, predictions)
    print(f"MAE validation : {mae:.2f}")

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    booster.save_model(MODEL_PATH)
    print(f"Modèle sauvegardé dans {MODEL_PATH}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--force", action="store_true", help="Forcer la réécriture")
    args = parser.parse_args()
    if MODEL_PATH.exists() and not args.force:
        print(f"{MODEL_PATH} existe déjà. Utilisez --force pour écraser.")
    else:
        train(force=args.force)
