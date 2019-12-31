'use strict';

const mock = require('egg-mock');
const assert = require('assert');
const helper = require('./helper');

describe('test/thrift-multiplex-client.test.js', () => {
  let app;
  before(async () => {
    app = mock.app({
      baseDir: 'apps/thrift-multiplex-client-test',
    });
    await app.ready();
    await helper.multiServiceReady();
    // console.log('singleService ======');
    // console.log(singleService);
    await helper.singleServiceReady();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('single service request', async () => {
    const client = app.thriftMultiplexClient.get('singleEgg').client;
    const res = await client.sayHello();
    assert(res === 'Hi, i am egg service!');
  });

  it('multi service request', async () => {
    const eggClient = app.thriftMultiplexClient.get('multiEggService').client;
    const duckClient = app.thriftMultiplexClient.get('multiDuckEggService').client;
    const eggRes = await eggClient.sayHello();
    const duckRes = await duckClient.sayHello();
    assert(eggRes === 'Hi, i am egg service!');
    assert(duckRes === 'Hi, i am duck\'s egg service!');
  });

});
