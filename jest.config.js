module.exports = {
  testEnvironment: "jest-environment-jsdom",
  preset: "vite-jest",
  testMatch: [
    "<rootDir>/lib/**/__tests__/**/*.{js,jsx,ts,tsx}",
    "<rootDir>/lib/**/*.{spec,test}.{js,jsx,ts,tsx}",
  ],
  moduleNameMapper: {
    "\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  reporters: ["default", "<rootDir>/node_modules/vite-jest/reporter.cjs"],
};
