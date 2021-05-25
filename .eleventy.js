const lcf = require('./lcf')
const chalk = require('chalk')

module.exports = {
  initArguments: {},
  configFunction: function (eleventyConfig) {
    eleventyConfig.addLinter("logical-content-flow", function (content, inputPath, outputPath) {
      if (!outputPath.endsWith('.html'))
        return
    
      const report = lcf(content)

      if (report.results.h1 == 0 || report.results.h1 > 1 || report.results.missing > 0 || report.results.empty > 0 )
        console.log(chalk.red(`Logical Content Flow Linter: ${outputPath}`))
      else if (report.results.length > 0)
        console.log(chalk.yellow(`Logical Content Flow Linter: ${outputPath}`))
    
      if (report.results.h1 == 0)
        console.error(chalk.red(`Missing primary H1 heading.`))

      if (report.results.h1 > 1)
        console.error(chalk.red(`Multiple primary H1 headings.`))

      if (report.results.missing > 0)
        console.error(chalk.red(`${report.results.missing} missing heading/s.`))

      if (report.results.empty > 0)
        console.warn(chalk.red(`${report.results.empty} empty heading/s.`))

      if (report.results.length > 0)
        console.warn(chalk.yellow(`${report.results.length} heading/s identified as longer than expected.`))
    })
  }
}