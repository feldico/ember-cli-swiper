'use strict';

module.exports = {
  name: 'ember-cli-swiper',

  options: {
    babel: {
      plugins: [require.resolve('ember-auto-import/babel-plugin')],
    },
    sassOptions: {
      includePaths: ['node_modules/swiper'],
    },
  },
};
