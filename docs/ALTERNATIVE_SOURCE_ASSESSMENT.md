# Alternative source decision record

**Status: no third-party dataset approved for import.**

The original Dreamlight Valley Wiki API returns HTTP 403 from GitHub Actions. The HTML access probe stopped because it could not verify robots.txt; it did **not** test the Collections page. Do not retry blocked access or infer scraping permission.

## Candidate GitHub projects

- https://github.com/killingsworth-kristen/DDV-catalogue-API — public repository, README currently minimal. No standard LICENSE / LICENSE.md file found in the initial review.
- https://github.com/FeelinProggy/DDVTracker — public tracker project, README includes development instructions. No standard LICENSE / LICENSE.md file found in the initial review.

A public GitHub repository is **not** equivalent to permission to redistribute its datasets. Absence of a top-level license file is not conclusive proof of no permission; check repository metadata, nested files, provenance, and contact maintainers if needed. Game images and game content may have separate rights.

## Required before automatic ingestion

1. Confirm source dataset exists and is actually maintained; inspect schema, categories, coverage and last update.
2. Identify applicable reuse terms for the *data*, not just source code. Record the source and any attribution requirements.
3. Run a **read-only** name comparison. Treat missing names as candidates, not automatic additions.
4. Review new item identity, universe, zone, and IDs; do not overwrite existing entries.
5. Preserve local user progress. Publish changes only through reviewable pull requests.

The workflow `.github/workflows/probe-ddv-alternative-sources.yml` checks **metadata only**. A green run does not satisfy these gates or authorize copying data.
