# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2024-09-25

### Added
- Implemented `index.js`: uploads a release asset via `upload_url`, authenticating with the `GITHUB_TOKEN` environment variable.
- Immutable-release detection: fails with actionable guidance when GitHub rejects an asset upload because the release is immutable (assets must be uploaded while the release is still a draft).
- Fails with a clear error if an asset with the same name already exists on the release (no overwrite).
- New opt-in `publish_draft` input (default `true`): if the release is a draft, it is published after a successful asset upload.
- New outputs: `asset_id`, `asset_url`, `browser_download_url`.
- New `src/isImmutableReleaseError.js` helper to classify GitHub's immutable-release upload rejection.

### Changed
- `action.yml` inputs/outputs/description updated to match the new upload logic: inputs `upload_url`, `asset_path`, `asset_name`, `asset_content_type`, `publish_draft`; outputs `asset_id`, `asset_url`, `browser_download_url`.


