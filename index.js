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

    const key = core.getInput('key');

    const threshold = Number(core.getInput("threshold")) || 70;
    const strategy = core.getInput("strategy") || "mobile";
    // Output a formatted report to the terminal
    const header = `Running Page Speed Insights for ${url}`;
    console.log(header);
    core.setOutput('outputTestHeader', header);
   ;(async () => {
      const results = await psi.output(url, {
        ...(key ? {key} : undefined),
        ...(key ? undefined : {nokey: "true"}),
        strategy,
        format: "cli",
        threshold
      });
      console.log(`::set-output name=pageSpeetdTestResponse::${results}`);
      core.setOutput('outputTestSuccess', results);
      exec(`echo "OUTPUT_RESULTS=${results}" >> $GITHUB_OUTPUT`);
      console.log(results);
    })();
  } catch (error) {
    core.setOutput('outputTestError', error.message);
    core.setFailed(error.message);
  }
};

run();
