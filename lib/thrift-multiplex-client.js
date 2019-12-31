'use strict';

const MultiClientManager = require('./multi-client-manager');

function thriftMultiplexClient(config, app) {
  const clientManager = new MultiClientManager(app);
  const client = clientManager.registerClient(config, config.alias);
  return client;
}

module.exports = app => {
  app.addSingleton('thriftMultiplexClient', thriftMultiplexClient);
};

