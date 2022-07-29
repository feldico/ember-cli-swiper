'use strict';

const fs = require('fs')

const nodeModules = require('find-node-modules')();
const possibleLocations = nodeModules.map(path => `${path}/swiper`);
const existentLocations = possibleLocations.filter(path =>
  fs.existsSync(path)
);

module.exports = {
  name: 'ember-cli-swiper',

  options: {
    babel: {
      plugins: [require.resolve('ember-auto-import/babel-plugin')],
    },
    sassOptions: {
      includePaths: existentLocations,
    },
  },
};
