var githubhook = require('githubhook');
var sys = require('sys');
var exec = require('child_process').exec;

// configure listener for github changes
var github = githubhook({
  /* options */
  host: '0.0.0.0',
  port: 8082,
  path: '/github/callback',
  secret: '123456'
});

// listen to push on github on branch master
github.on('push', function (repo, ref, data) {
  function puts(error, stdout, stderr) { sys.puts(stdout);}
  exec('deploy.sh',puts);
  //exec('unset \'GIT_DIR\'',puts);
  //exec('cd ~/mortgage.git && git fetch origin && git pull origin master && npm install
  //&& sudo PORT=80 NODE_ENV=build forever start src/server/app.js',puts);
  //exec('exec git update-server-info',puts);
});

// listen to github push
github.listen();
