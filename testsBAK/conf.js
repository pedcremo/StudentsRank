exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:8000/',
    specs: ['login.js'],
    capabilities: {
        browserName: 'chrome'
      }
  };

