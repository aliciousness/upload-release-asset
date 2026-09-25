# Release Workflow

This repository includes a GitHub Actions workflow for creating automated releases based on the version in `package.json`.

## Release Workflow (`release.yml`)

This workflow creates releases using the version declared in `package.json` and fails if that version tag already exists.

### Triggers:

- **PR merge to main**: When a PR modifying `package.json` is successfully merged into main
- **Manual dispatch**: Can be triggered manually

### Features:

- ✅ Uses the existing version from `package.json`
- ✅ Fails fast if the version tag already exists (prevents duplicates)
- ✅ Generates changelog from git commits since last tag
- ✅ Builds and lints the project before release
- ✅ Creates git tag and GitHub release
- ✅ Uploads built assets (`dist` folder) if available
- ✅ Includes comparison links between versions

### Usage:

1. **Update version in package.json**: Manually edit the version in `package.json`
2. **Create PR**: Create a PR with the version change:

   ```bash
   # Create a new branch
   git checkout -b release/v0.0.2

   # Manually edit package.json to update version to 0.0.2
    # OR use pnpm version (but don't commit the tag)
    pnpm version patch --no-git-tag-version

   # Commit and push
   git add package.json
   git commit -m "chore: bump version to 0.0.2"
   git push origin release/v0.0.2
   # Then create and merge PR through GitHub UI
   ```

3. **Manual trigger**: Go to Actions → "Create Release" → "Run workflow"

### Important Notes:

- ⚠️ **The workflow will fail if the version tag already exists**
- ✅ You must manually update the version in `package.json` to a new version
- ✅ The workflow uses the exact version from `package.json` - it doesn't modify it

## Release Notes Generation

The workflow automatically generates release notes by:

1. Finding all commits since the last tag
2. Formatting them as a bulleted list with commit hashes
3. Including comparison links between versions
4. Uploading any built assets from the `dist` folder

## Permissions Required

The workflows require the following permissions (already configured):

- `contents: write` - To create tags and releases
- `pull-requests: read` - To access PR information for changelog generation

## Best Practices

1. **Use semantic versioning**: Follow semver (patch.minor.major) in your package.json
2. **Write meaningful commit messages**: They become your release notes
3. **Test before release**: Both workflows run linting and building before creating releases
4. **Use conventional commits**: Consider using conventional commit format for better changelogs
5. **PR-based releases**: The workflow triggers on PR merges, ensuring code review before releases
6. **Branch protection**: Consider enabling branch protection rules on main to require PR reviews
7. **Version management**: Always update `package.json` version before creating releases
8. **Unique versions**: Ensure each release has a unique version number to avoid tag conflicts

## Workflow File Location

- `.github/workflows/release.yml` - Release workflow

## Troubleshooting

### "Tag already exists" Error

- The workflow will fail if the version tag already exists
- Update the version in `package.json` to a new, unique version number

### Missing Release Assets

- Ensure your `pnpm build` script creates a `dist` folder
- Built assets are automatically zipped and uploaded to releases

### Permission Errors

- Ensure the repository has Actions enabled
- Check that the `GITHUB_TOKEN` has sufficient permissions