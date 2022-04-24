const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: 
            { 
              '@primary-color': '#990AE3',
              '@layout-header-background': '#990AE3',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};