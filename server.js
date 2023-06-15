const nodemon = require('nodemon');
const browserSync = require('browser-sync');

const server = nodemon({
  script: 'App.js'
});

server.on('restart', () => {
  setTimeout(() => {
    browserSync.reload({
      stream: false
    });
  }, 1000);
});

browserSync({
  proxy: 'localhost:8081',
  files: ['views/**/*.*', 'public/**/*.*'],
  ignore: ['node_modules'],
  reloadDelay: 500
});
