const rp = require('request-promise');
const cheerio = require('cheerio');
const chalk = require('chalk');
const logUpdate = require('log-update');
const Table = require('cli-table3');

const table = new Table({ head: ['Channel', 'Sub Count', 'Difference'] });

setInterval(async () => {
  const uri = 'https://www.youtube.com/user';
  const getSubs = $ => $('.yt-subscription-button-subscriber-count-branded-horizontal').toArray()[0].attribs['aria-label'].split(' ')[0];
  const transform = str => parseInt(str.split(',').join(''));

  const pewds = await rp({ uri: `${uri}/PewDiePie` }).then(html => transform(getSubs(cheerio.load(html))));
  const ts = await rp({ uri: `${uri}/tseries` }).then(html => transform(getSubs(cheerio.load(html))));

  const formatName = name => chalk.bold(name);
  const formatSubs = num => chalk.bold(num.toLocaleString('en-US'));
  const formatDiff = (yt1, yt2) => (yt1 - yt2 > 0
    ? chalk.bold(`+${(yt1 - yt2).toLocaleString('en-US')}`)
    : chalk.bold((yt1 - yt2).toLocaleString('en-US')));

  table.push(
    { [formatName('PewDiePie')]: [formatSubs(pewds), formatDiff(pewds, ts)] },
    { [formatName('T-Series')]: [formatSubs(ts), formatDiff(ts, pewds)] },
  );
  logUpdate(table.toString());
  table.length = 0;
}, 3000);
