/**
 * Detects GitHub's immutable-release upload rejection.
 * Matches softprops/action-gh-release: status 422 + message /immutable release/i.
 */
export function isImmutableReleaseError(error) {
  const status = error?.status ?? error?.response?.status;
  const message = error?.response?.data?.message ?? error?.message ?? '';
  return status === 422 && /immutable release/i.test(String(message));
}
