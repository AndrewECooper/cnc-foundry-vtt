import { existsSync, readFileSync } from 'node:fs';
import { rimraf } from 'rimraf';
import lnk from 'lnk';
import * as path from 'path';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

/** Link build to User Data folder */

const argv = await yargs(hideBin(process.argv))
  .option('c', {
    alias: 'clean',
    describe: 'remove the link instead of creating one',
  })
  .help()
  .parse();
const config = JSON.parse(readFileSync('foundryconfig.json', 'utf-8'));
const name = 'castles-and-crusades';
const destDir = 'systems';

let linkDir;
if (config.dataPath) {
  if (!existsSync(path.join(config.dataPath, 'Data'))) {
    throw Error('User Data path invalid, no Data directory found');
  }

  linkDir = path.join(config.dataPath, 'Data', destDir, name);
} else {
  throw Error('No User Data path defined in foundryconfig.json');
}
const linkDirExists = existsSync(linkDir);
if (argv.clean || argv.c) {
  if (linkDirExists) {
    console.log(chalk.green(`Removing link to ${chalk.blueBright(linkDir)}`));
    rimraf.sync(linkDir);
  } else {
    console.log(chalk.yellow('No directory to remove'));
  }
} else if (!linkDirExists) {
  console.log(linkDir);
  console.log(chalk.green(`Creating link to ${chalk.blueBright(linkDir)}`));
  lnk.sync('./', linkDir, { cwd: './dist', parents: true });
}
