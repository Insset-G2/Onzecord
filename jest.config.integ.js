module.exports = {
  globalSetup: "./__tests__/__setup__/setup.js",
  globalTeardown: "./__tests__/__setup__/teardown.js",
  testPathIgnorePatterns: ["__tests__/__setup__"],
  testTimeout: 5000,
};