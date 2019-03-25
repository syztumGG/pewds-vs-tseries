const rp = require('request-promise');
const cheerio = require('cheerio');
const chalk = require('chalk');
const Table = require('cli-table3');
const logUpdate = require('log-update');

const table = new Table({ head: ['Channel', 'Sub Count', 'Difference'].map(el => chalk.blue(el)) });

setInterval(async () => {
  const uri = 'https://www.youtube.com/user';
  const getSubs = $ => $('.yt-subscription-button-subscriber-count-branded-horizontal').toArray()[0].attribs['aria-label'].split(' ')[0];
  const transform = str => parseInt(str.split(',').join(''));

  const pewds = await rp({ uri: `${uri}/PewDiePie` }).then(html => transform(getSubs(cheerio.load(html))));
  const ts = await rp({ uri: `${uri}/tseries` }).then(html => transform(getSubs(cheerio.load(html))));

  const formatDiff = (yt1, yt2) => (yt1 - yt2 > 0
    ? chalk.green.bold(`+${(yt1 - yt2).toLocaleString('en-US')}`)
    : chalk.red.bold((yt1 - yt2).toLocaleString('en-US')));

  table.push(
    { [chalk.bold('PewDiePie')]: [chalk.bold(pewds.toLocaleString('en-US')), formatDiff(pewds, ts)] },
    { [chalk.bold('T-Series')]: [chalk.bold(ts.toLocaleString('en-US')), formatDiff(ts, pewds)] },
  );
  logUpdate(table.toString());
  table.length = 0;
}, 3000);
