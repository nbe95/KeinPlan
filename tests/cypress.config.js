const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const readPdf = async (pathToPdf) =>
  new Promise((resolve) => {
    const resolvedPath = path.resolve(pathToPdf);
    pdf(fs.readFileSync(resolvedPath)).then(({ text }) => resolve(text.replaceAll(/\s+/g, "")));
  });

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        readPdf,
      });
    },
    baseUrl: "http://localhost:3000/",
    env: {
      BACKEND_URL: "http://localhost:8080/",
    },
  },
});
