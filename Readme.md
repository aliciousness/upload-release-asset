> NOTE: To update the readme, just run the `npm run prebuild` This script will lint the code, and update the readme with the docs for said action using the [action.yml](./action.yml) file and the name of the project and version from your [package.json](./package.json) file

<!-- action-docs-header source="action.yml" -->

<!-- action-docs-header source="action.yml" -->

<!-- action-docs-inputs source="action.yml" -->
## Inputs

| name | description | required | default |
| --- | --- | --- | --- |
| `upload_url` | <p>The upload<em>url of the release (e.g. github.event.release.upload</em>url)</p> | `true` | `""` |
| `asset_path` | <p>Local path to the file to upload</p> | `true` | `""` |
| `asset_name` | <p>Name the asset will have on the release</p> | `true` | `""` |
| `asset_content_type` | <p>Content-Type of the asset (e.g. 'application/zip')</p> | `true` | `""` |
| `publish_draft` | <p>If the release is a draft, publish it after the asset uploads successfully</p> | `false` | `true` |
<!-- action-docs-inputs source="action.yml" -->

<!-- action-docs-outputs source="action.yml" -->
## Outputs

| name | description |
| --- | --- |
| `asset_id` | <p>ID of the uploaded asset</p> |
| `asset_url` | <p>API URL of the uploaded asset</p> |
| `browser_download_url` | <p>Public download URL of the uploaded asset</p> |
<!-- action-docs-outputs source="action.yml" -->

<!-- action-docs-usage source="action.yml" project="aliciousness/ACTION-upload-release-asset" version="v1.0.0" -->
## Usage

```yaml
- uses: aliciousness/ACTION-upload-release-asset@v1.0.0
  with:
    upload_url:
    # The upload_url of the release (e.g. github.event.release.upload_url)
    #
    # Required: true
    # Default: ""

    asset_path:
    # Local path to the file to upload
    #
    # Required: true
    # Default: ""

    asset_name:
    # Name the asset will have on the release
    #
    # Required: true
    # Default: ""

    asset_content_type:
    # Content-Type of the asset (e.g. 'application/zip')
    #
    # Required: true
    # Default: ""

    publish_draft:
    # If the release is a draft, publish it after the asset uploads successfully
    #
    # Required: false
    # Default: true
```
<!-- action-docs-usage source="action.yml" project="aliciousness/ACTION-upload-release-asset" version="v1.0.0" -->

## Usage

```yaml
- uses: aliciousness/ACTION-upload-release-asset@v1
  env:
    GITHUB_TOKEN: ${{ github.token }}
  with:
    upload_url: ${{ github.event.release.upload_url }}
    asset_path: ./platform-cli.zip
    asset_name: platform-cli.zip
    asset_content_type: application/zip
```

- `GITHUB_TOKEN` must be passed explicitly via `env:` — GitHub Actions does not inject it into a JavaScript action's environment automatically.
- Fails on **immutable releases**: assets can only be added while the release is still a draft. If the release is already published and immutable, upload it before publishing.
- Fails if an asset with the same `asset_name` already exists on the release — this action does not overwrite existing assets.
- `publish_draft` (default `true`): if the release is currently a draft, it will be published after the asset uploads successfully. Set to `false` to leave a draft release as a draft.
