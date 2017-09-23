var deployd = require('deployd');

var server = deployd({
  port: process.env.PORT || 5000,
  env: 'production',
  db: {
    host: process.env.MONGODB_HOST,
    port: process.env.MONGODB_PORT,
    name: process.env.MONGODB_NAME,
    credentials: {
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD
    }
  }
});

server.listen();

server.on('listening', function() {
  console.log("Server is listening");
});

server.on('error', function(err) {
  console.error(err);
  process.nextTick(function() { // Give the server a chance to return an error
    process.exit();
  });
});
