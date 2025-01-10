const dotenv = require("dotenv");
dotenv.config({
  path: ".env.development",
});

const nestJest = require("next/jest");

const createJestConfig = nestJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  loadEnvConfig: ".env.development",
});

module.exports = jestConfig;
