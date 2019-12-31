'use strict';

const eggServiceGenJs = require('../../../../thrift/gen-nodejs/EggService');
const duckEggServiceGenJs = require('../../../../thrift/gen-nodejs/DuckEggService');

/**
 * egg-thrift-multiplex-client default config
 * @member Config#thriftMultiplexClient
 * @property {String} SOME_KEY - some description
 */
exports.thriftMultiplexClient = {
  app: true,
  agent: false,
  reconnect: true, // 短线是否自动重连
  reconnectMaxCount: 50000, // 断线后重连的最大次数
  reconnectDelay: 3000, // 每隔n秒尝试重连
  clients: {
    multiEggService: {
      host: '127.0.0.1',
      port: 10241,
      serverName: 'eggService',
      client: eggServiceGenJs,
      extendOptions: {},
    },
    multiDuckEggService: {
      host: '127.0.0.1',
      port: 10241,
      serverName: 'duckEggService',
      client: duckEggServiceGenJs,
      extendOptions: {},
    },
    singleEgg: {
      host: '127.0.0.1',
      port: 10240,
      client: eggServiceGenJs,
      extendOptions: {},
    },
  },
};
