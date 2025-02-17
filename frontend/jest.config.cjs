// jest.config.cjs
// Export the Jest configuration using CommonJS syntax
module.exports = {
    // Set the test environment to jsdom so that DOM APIs are available
    testEnvironment: "jest-environment-jsdom",
    // Automatically load the jest setup file after the environment is set up
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"]
};
