'use strict';

const thrift = require('thrift');
const EggService = require('../gen-nodejs/EggService');

const port = 10240;

const server = thrift.createServer(EggService, {
  sayHello(cb) {
    cb(null, 'Hi, i am egg service!');
  },
});

exports.server = server;
exports.port = port;

// server.listen(port);

// server.on('listening', () => {
//   console.log(`Server bound to port ${port}.`);
// });
