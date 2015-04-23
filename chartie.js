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
      fs.writeFile('holitas.png', imageData, 'binary', function (error) {
        if (error) {
          throw error;
        }
      });
    });
  });
}

function initialize () {
  var pkg = require(path.join(__dirname, 'package.json'));

  program
    .version(pkg.version)
    .option('-t, --title', 'Add title', '')
    .option('-c, --chart', 'Add chart type [line]')
    .option('-o, --output', 'Output file name [chart.png]', 'chart.png')
    .parse(process.argv);

  if (!program.chart) {
    chalk.red('Missing chart type. Type --help for documentation');
    return false;
  }

  if (!program.output) {
    chalk.red('Missing output path. Type --help for documentation');
    return false;
  }
}

+function () {
  'use strict';

  var chart = quiche('line'),
      months = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Nov', 'Dic'];

  initialize();


  chart.setTitle(program.title);
  chart.addData([1000, 1500, 2000, 1300, 5000, 4300, 800, 1000, 2500, 2200, 2000, 2000], 'kWh', '4e4e99');
  chart.addAxisLabels('x', months);
  chart.setWidth(430);
  chart.setHeight(230);

  saveImage(chart);
}();
