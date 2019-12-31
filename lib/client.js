'use strict';

/* thrift 连接类 */
const EventEmitter = require('events');
const thrift = require('thrift');

class Client extends EventEmitter {
  constructor(clientConfig, alias = '', mp, serverName) {
    super();
    this.config = clientConfig;
    this.alias = alias || `${clientConfig.host}:${clientConfig.port}`;
    // this.alias = alias || clientConfig.alias;
    this.hasReconnectedCount = 0;
    this.connection = null;
    this.client = null;
    this.mp = mp;
    this.serverName = serverName;
    // 初始化时自动创建 client
    this.createClient(this.config, alias, mp, serverName);
  }

  createConnection(clientConfig, alias) {
    if (Client.connectionMap.has(alias)) {
      return Client.connectionMap.get(alias);
    }
    const {
      host,
      port,
      extendOptions,
      transport = thrift.TBufferedTransport,
      protocol = thrift.TBinaryProtocol,
    } = clientConfig;
    const connection = thrift.createConnection(host, port, {
      transport,
      protocol,
      ...extendOptions,
    });
    this.connection = connection;
    connection.on('connect', e => this.emit('connect', e));

    connection.on('close', e => {
      this.emit('close', e);
      Client.connectionMap.delete(alias);
    });

    connection.on('error', e => this.emit('error', e));
    connection.on('timeout', e => this.emit('timeout', e));

    return connection;
  }

  createClient(clientConfig, alias, mp, serverName) {
    const connection = this.createConnection(clientConfig, alias);

    let client;
    if (mp && serverName) {
      client = mp.createClient(serverName, clientConfig.client, connection);
    } else {
      client = thrift.createClient(clientConfig.client, connection);
    }
    this.client = client;
    return client;
  }

  reConnect() {
    this.hasReconnectedCount++;
    const { config, alias, mp, serverName } = this;
    this.createClient(config, alias, mp, serverName);
  }
}

Client.connectionMap = new Map();

module.exports = Client;
