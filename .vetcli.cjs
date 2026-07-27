/**
 * Visual E2E CLI config for release / pub.
 */
module.exports = {
  allowBranch: ["master"],
  bumpFiles: ["package.json", "package-lock.json"],
  tagPrefix: "v",
  releasePrefix: "release-v",
  changelog: false,
  hooks: {
    postpublish:
      "npm run build:manifests && npm run commit:generated && npm run build && npm run sync:pages",
  },
};
