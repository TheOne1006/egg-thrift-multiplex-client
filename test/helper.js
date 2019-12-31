'use strict';


const mulit = require('./thrift/server/multiService');
const single = require('./thrift/server/singleService');


const mulitService = mulit.server;
const mulitPort = mulit.port;

const singleService = single.server;
const singlePort = single.port;


let mulitReady = false;

const multiServiceReady = async () => {
  if (mulitReady) return mulitService;
  mulitReady = true;

  return new Promise(resolve => {
    mulitService.listen(mulitPort);
    mulitService.on('listening', () => {
      console.log(`mulitService start at: ${mulitPort}`);
      resolve(mulitService);
    });
  });
};

let singleReady = false;

const singleServiceReady = async () => {
  if (singleReady) return singleService;

  singleReady = true;
  return new Promise(resolve => {
    singleService.listen(singlePort);
    singleService.on('listening', () => {
      console.log(`singleService start at: ${singlePort}`);
      resolve(singleService);
    });
  });
};


exports.multiServiceReady = multiServiceReady;
exports.singleServiceReady = singleServiceReady;

before(async () => {
  await multiServiceReady();
  await singleServiceReady();
});
