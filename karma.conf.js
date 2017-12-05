module.exports = function(config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine','browserify'],
      browsers: ['Chrome','ChromeHeadlessRANK'],

      customLaunchers: {
        ChromeHeadlessRANK: {
          base: 'Chrome',
          flags: ['--headless', '--disable-gpu', '--remote-debugging-port=9222']
        }
      },
      // Which plugins to enable
      plugins: [
        'karma-chrome-launcher',
        'karma-browserify',
        'karma-jasmine'
      ],
      files: [
        'lib/jquery/jquery.min.js',
        'src/client/**/*.js',
        'tests/**/*.js'
      ],

      singleRun:false,

      exclude: [
      ],

      preprocessors: {
        'src/**/*.js': ['browserify'],
        'tests/**/*.js': ['browserify']
      },
      browserify:{
        debug: true,
        transform: [['babelify', {presets: ['env']}]]
      }
    });
  };
