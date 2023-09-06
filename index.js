const core = require("@actions/core");
const exec = require('@actions/exec');
const psi = require("psi");

const run = async () => {
  try {
    const url = core.getInput("url");
    if (!url) {
      core.setFailed("Url is required to run Page Speed Insights.");
      return;
    }
    const { exec } = require('child_process');
    const key = core.getInput('key');

    const threshold = Number(core.getInput("threshold")) || 70;
    const strategy = core.getInput("strategy") || "mobile";
    // Output a formatted report to the terminal
    const header = `Running Page Speed Insights for ${url}`;
    exec(`echo "OUTPUT_HEADER=${header}" >> $GITHUB_OUTPUT`);
    console.log(header);
    (async () => {
      const results = await psi.output(url, {
        ...(key ? {key} : undefined),
        ...(key ? undefined : {nokey: "true"}),
        strategy,
        format: "cli",
        threshold
      });
      exec(`echo "OUTPUT_BODY=${results}" >> $GITHUB_OUTPUT`);
      console.log(results);
    })();
  } catch (error) {
    core.setOutput('outputTestError', error.message);
    core.setFailed(error.message);
  }
};

run();
