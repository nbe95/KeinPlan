/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
};

const { configureRuntimeEnv } = require("next-runtime-env/build/configure");
configureRuntimeEnv();
