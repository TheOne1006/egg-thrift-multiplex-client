'use strict';

const thriftMultiplexClient = require('./lib/thrift-multiplex-client');

module.exports = app => {
  if (app.config.thriftMultiplexClient.app) thriftMultiplexClient(app);
};
