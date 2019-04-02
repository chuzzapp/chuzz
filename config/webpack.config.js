var path = require('path');
var useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
var deployProduction = (process.env.DEPLOY_PRODUCTION === 'YES');

var procEnv = process.env.IONIC_ENV;

if (deployProduction) {
  module.exports = function () {
      useDefaultConfig[procEnv].resolve.alias = {
          "@environment": path.resolve(__dirname + '/../src/config/environment.prod.ts'),
      };
      return useDefaultConfig;
  };
} else {
  module.exports = function () {
      useDefaultConfig[procEnv].resolve.alias = {
          "@environment": path.resolve(__dirname + '/../src/config/environment.' + process.env.IONIC_ENV + '.ts'),
      };
      return useDefaultConfig;
  };
}
