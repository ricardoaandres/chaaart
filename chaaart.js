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
    .parse(process.argv);

  // checking if chart options is valid
  if (!program.chart || typeof program.chart !== 'string' || !program.chart.match(/(line|pie|bar|qr)/)) {
    console.log(chalk.red(errorMessage), 'chart type');
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

  var chart, months;

  initialize();

  chart = quiche(program.chart);
  months = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Nov', 'Dic'];

  chart.setTitle(program.title);
  chart.addData([1000, 1500, 2000, 1300, 5000, 4300, 800, 1000, 2500, 2200, 2000, 2000], 'kWh', '4e4e99');
  chart.addAxisLabels('x', months);
  chart.setWidth(430);
  chart.setHeight(230);

  saveImage(chart);
}();
