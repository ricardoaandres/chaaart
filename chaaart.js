#!/usr/bin/env node

var quiche = require('quiche'),
    program = require('commander'),
    https = require('https'),
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs');

function saveImage (chart) {
  var request = https.get(chart.getUrl(true));

  request.on('response', function (response) {
    var imageData = '';

    response.setEncoding('binary');

    response.on('data', function (chunk) {
      imageData += chunk;
    });

    response.on('end', function () {
      fs.writeFile(program.output, imageData, 'binary', function (error) {
        if (error) {
          throw error;
        }
      });
    });
  });
}

function initialize () {
  var pkg = require(path.join(__dirname, 'package.json')),
      errorMessage = 'Missing %s. Type --help for documentation';

  process.title = 'chaaart';
  program.name = 'chaaart';

  program.on('--help', function () {
    console.log('  Example:');
    console.log('');
    console.log('    $ chaaart --chart line --title awesome --output chart.png');
    console.log('    $ chaaart -c line -t awesome -o chart.png');
    console.log('');
  });

  program
    .version(pkg.version)
    .option('-t, --title [value]', 'Add chart title')
    .option('-c, --chart <value>', 'Add chart type', /^(line|bar|pie|qr)$/i)
    .option('-o, --output <value>', 'Output file name')
    .option('-j, --json <value>', 'Input file name', 'sample.json')
    .parse(process.argv);

  // checking if chart options is valid
  if (!program.chart || typeof program.chart !== 'string' || !program.chart.match(/(line|pie|bar|qr)/)) {
    console.log(chalk.red(errorMessage), 'chart type');
    process.exit(1);
  }

  // checking if output path is valid
  if (!program.json || typeof program.json !== 'string') {
    console.log(chalk.red(errorMessage), 'json path');
    process.exit(1);
  }

  // checking if output path is valid
  if (!program.output || typeof program.output !== 'string') {
    console.log(chalk.red(errorMessage), 'output path');
    process.exit(1);
  }
}

+function () {
  'use strict';

  var chart, xAxisLabels, json;

  initialize();

  if (program.chart === 'line') {
    chart = quiche(program.chart);
    json = JSON.parse(fs.readFileSync(program.json, 'utf8'));

    xAxisLabels = json.xAxisLabels;

    chart.setTitle(program.title);
    chart.addAxisLabels('x', xAxisLabels);
    chart.setWidth(430);
    chart.setHeight(230);


    json.data.forEach(function (data) {
      console.log(data);
      chart.addData(data.values, data.legend, data.color);
    });

    saveImage(chart);
  } else {
    console.log(chalk.blue('We are very ashamed, but %s chart is not yet supported :('), program.chart);
    console.log(chalk.blue('Open an issue or fork it to make chaaart even better'));
    console.log('');
    console.log(chalk.yellow('https://github.com/ricardoaandres/chaaart/issues'));
    process.exit(1);
  }
}();
