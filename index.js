import * as core from '@actions/core';
import { getOctokit } from '@actions/github';
import { statSync, readFileSync } from 'node:fs';
import { env } from 'node:process';
import { isImmutableReleaseError } from './src/isImmutableReleaseError.js';

async function run() {
  try {
    const uploadUrl = core.getInput('upload_url', { required: true });
    const assetPath = core.getInput('asset_path', { required: true });
    const assetName = core.getInput('asset_name', { required: true });
    const assetContentType = core.getInput('asset_content_type', { required: true });
    const publishDraft = core.getBooleanInput('publish_draft');

    const token = env.GITHUB_TOKEN;
    if (!token) {
      core.setFailed('GITHUB_TOKEN environment variable is required. Set it on the step: env: GITHUB_TOKEN: ${{ github.token }}');
      return;
    }

    let stats;
    try {
      stats = statSync(assetPath);
    } catch {
      core.setFailed(`Asset file not found: ${assetPath}`);
      return;
    }
    if (!stats.isFile()) {
      core.setFailed(`Asset path is not a file: ${assetPath}`);
      return;
    }

    const octokit = getOctokit(token);

    let asset;
    try {
      const response = await octokit.request(`POST ${uploadUrl}`, {
        name: assetName,
        data: readFileSync(assetPath),
        headers: { 'content-type': assetContentType },
      });
      asset = response.data;
    } catch (error) {
      if (isImmutableReleaseError(error)) {
        core.setFailed(
          `Cannot upload asset '${assetName}': the release is immutable. Assets can only be added while the release is a draft. Create the release as a draft, upload assets, then publish.`,
        );
        return;
      }
      if (error.status === 422) {
        core.setFailed(`Asset '${assetName}' already exists on this release. This action does not overwrite existing assets.`);
        return;
      }
      throw error;
    }

    core.setOutput('asset_id', asset.id);
    core.setOutput('asset_url', asset.url);
    core.setOutput('browser_download_url', asset.browser_download_url);
    core.info(`Uploaded ${asset.name} (id ${asset.id})`);

    if (publishDraft) {
      const releaseIdMatch = uploadUrl.match(/\/releases\/(\d+)\/assets/);
      const repoMatch = uploadUrl.match(/\/repos\/([^/]+)\/([^/]+)\/releases/);
      if (!releaseIdMatch || !repoMatch) {
        core.warning('Could not determine release id from upload_url; skipping publish_draft');
      } else {
        const releaseId = Number(releaseIdMatch[1]);
        const [, owner, repo] = repoMatch;
        const { data: release } = await octokit.rest.repos.getRelease({ owner, repo, release_id: releaseId });
        if (release.draft === true) {
          await octokit.rest.repos.updateRelease({ owner, repo, release_id: releaseId, draft: false });
          core.info(`Published release ${releaseId}`);
        } else {
          core.info('Release is not a draft; skipping publish');
        }
      }
    }
  } catch (error) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}

run();