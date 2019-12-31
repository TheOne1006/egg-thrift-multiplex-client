'use strict';

const thrift = require('thrift');
const Client = require('./client');

class MultiClientManager {
  constructor(app) {
    this.app = app;
    this.globalConfig = app.config.thriftMultiplexClient;
    this.clientMap = new Map();
    this.multiplexerMap = new Map();
  }

  registerClient(clientConfig, alias = '') {
    alias = alias || `${clientConfig.host}:${clientConfig.port}`;

    // alias = alias || clientConfig.alias;
    if (this.clientMap.has(alias)) {
      return this.clientMap.get(alias);
    }

    // mp
    let mp;
    if (this.multiplexerMap.has(alias)) {
      mp = this.multiplexerMap.get(alias);
    } else if (clientConfig.serverName) {
      mp = new thrift.Multiplexer();
      this.clientMap.set(alias, mp);
    }

    const { serverName, ...restClientConfig } = clientConfig;
    const thriftClient = new Client(restClientConfig, alias, mp, serverName);
    this.clientMap.set(alias, thriftClient);

    // eslint-disable-next-line no-unused-vars
    thriftClient.on('connect', _e => {
      this.app.coreLogger.info(`[egg-thrift-multi-client] ${alias} 微服务已连接 ${clientConfig.host}:${clientConfig.port}`);
      thriftClient.hasReconnectedCount = 0;
    });

    thriftClient.on('error', e => {
      this.app.coreLogger.error(
        `[egg-thrift-multi-client] ${alias} 微服务发生错误 ${clientConfig.host}:${clientConfig.port}`,
        e
      );
    });

    thriftClient.on('timeout', e => {
      this.app.coreLogger.warn(
        `[egg-thrift-multi-client] ${alias} 微服务连接超时 ${clientConfig.host}:${clientConfig.port}`,
        e
      );
    });

    // eslint-disable-next-line no-unused-vars
    thriftClient.on('close', _e => {
      if (
        this.globalConfig.reconnect &&
        thriftClient.hasReconnectedCount < this.globalConfig.reconnectMaxCount
      ) {
        this.app.coreLogger.warn(
          `[egg-thrift-multi-client] ${alias} 微服务断开 ${clientConfig.host}:${clientConfig.port},
          ${this.globalConfig.reconnectDelay}ms后尝试第${thriftClient.hasReconnectedCount + 1}次重连`
        );
        setTimeout(() => {
          thriftClient.reConnect();
        }, this.globalConfig.reconnectDelay);
      } else {
        this.app.coreLogger.warn(`[egg-thrift-multi-client] ${alias} 微服务已断开 ${clientConfig.host}:${clientConfig.port}`);
      }
    });
    return thriftClient;
  }
}

module.exports = MultiClientManager;
