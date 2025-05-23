import csv
import json
import os

ranking_dir = "./ranking"
for filename in os.listdir(ranking_dir):
    if filename.endswith(".csv"):
        csv_path = os.path.join(ranking_dir, filename)
        json_path = os.path.join(ranking_dir, filename.replace(".csv", ".json"))
        with open(csv_path, newline='', encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            rows = list(reader)
        with open(json_path, "w", encoding="utf-8") as jsonfile:
            json.dump(rows, jsonfile, ensure_ascii=False, indent=2)
        print(f"Converted {csv_path} to {json_path}")