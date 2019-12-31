'use strict';

const thrift = require('thrift');
const EggService = require('../gen-nodejs/EggService');
const DuckEggService = require('../gen-nodejs/DuckEggService');

const port = 10241;

const mulit = new thrift.MultiplexedProcessor();

const processor1 = new EggService.Processor({
  sayHello(cb) {
    cb(null, 'Hi, i am egg service!');
  },
});
const processor2 = new DuckEggService.Processor({
  sayHello(cb) {
    cb(null, 'Hi, i am duck\'s egg service!');
  },
});

mulit.registerProcessor('eggService', processor1);
mulit.registerProcessor('duckEggService', processor2);

const server = thrift.createMultiplexServer(mulit);

exports.server = server;
exports.port = port;

// server.listen(port);

// server.on('listening', () => {
//   console.log(`Multiplex server bound to port ${port}.`);
// });
