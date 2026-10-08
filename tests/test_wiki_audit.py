"""Regression tests for the offline, read-only wiki audit."""
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "wiki_audit.py"
CATEGORIES = ("clothing", "furniture", "meals", "crafting")

class WikiAuditTests(unittest.TestCase):
    def run_audit(self, snapshot):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            catalog = root / "catalog.json"
            snapshot_file = root / "snapshot.json"
            report_file = root / "report.json"
            catalog_data = {"data": {"clothing": [{"id": 25, "name": "Atta Leaf Crown", "meta": "A BUG'S LIFE", "meta2": "DREAMLIGHT VALLEY"}]}, "checked": {"clothing": {"25": True}}, "owned": {"clothing": {"25": "owned"}}}
            catalog.write_text(json.dumps(catalog_data))
            snapshot_file.write_text(json.dumps(snapshot))
            before = catalog.read_bytes()
            process = subprocess.run([sys.executable, str(SCRIPT), "--catalog", str(catalog), "--snapshot", str(snapshot_file), "--output", str(report_file)], capture_output=True, text=True)
            after = catalog.read_bytes()
            report = json.loads(report_file.read_text()) if report_file.exists() else None
            return process, report, before, after

    def test_existing_item_and_candidate_without_mutation(self):
        snapshot = {key: [] for key in CATEGORIES}
        snapshot["clothing"] = ["Atta Leaf Crown", "New Unverified Item"]
        process, report, before, after = self.run_audit(snapshot)
        self.assertEqual(process.returncode, 0, process.stderr)
        self.assertEqual(before, after)
        self.assertTrue(report["snapshotMode"])
        self.assertEqual(report["categories"]["furniture"]["status"], "NOT_CHECKED")
        self.assertIsNone(report["categories"]["furniture"]["wikiPagesFound"])
        clothing = report["categories"]["clothing"]
        self.assertEqual(clothing["status"], "SNAPSHOT_COMPARED")
        self.assertEqual(clothing["exactNameMatches"], 1)
        self.assertEqual(len(clothing["reviewCandidates"]), 1)
        self.assertEqual(clothing["reviewCandidates"][0]["status"], "POSSIBLE_NEW")

    def test_empty_snapshot_is_rejected(self):
        process, report, before, after = self.run_audit({key: [] for key in CATEGORIES})
        self.assertNotEqual(process.returncode, 0)
        self.assertIsNone(report)
        self.assertEqual(before, after)

    def test_invalid_snapshot_is_rejected(self):
        process, report, before, after = self.run_audit({"clothing": ["Atta Leaf Crown"]})
        self.assertNotEqual(process.returncode, 0)
        self.assertIsNone(report)
        self.assertEqual(before, after)

if __name__ == "__main__":
    unittest.main()
