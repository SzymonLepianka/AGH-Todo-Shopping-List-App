// module.exports = (on, config) => {
//   require("@cypress/code-coverage/task")(on, config);
//   return config;
// };

const coverage = require("@cypress/code-coverage/task");

module.exports = (on, config) => {
  on("task", coverage.getCoverageTask(config));
};
