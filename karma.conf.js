module.exports = function(config) {
    config.set({
      frameworks: ['jasmine-jquery','jasmine','browserify'],
      reporters: ['spec'],
      browsers: ['PhantomJS'],
  
      files: [
        //'node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js',
        //'src/client/**/*.js',
        'dist/main.js',
        'tests/**/*.js'
      ],
      preprocessors: {
        'tests/**/*.js': [ 'browserify' ]
      },
      browserify:{
        debug: true
      }
    });
  };