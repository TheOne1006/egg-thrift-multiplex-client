//
// Autogenerated by Thrift Compiler (0.11.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
'use strict';

const thrift = require('thrift');
const Thrift = thrift.Thrift;
const Q = thrift.Q;


const ttypes = require('./test_types');
// HELPER FUNCTIONS AND STRUCTURES

const EggService_sayHello_args = function(args) {
};
EggService_sayHello_args.prototype = {};
EggService_sayHello_args.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    input.skip(ftype);
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

EggService_sayHello_args.prototype.write = function(output) {
  output.writeStructBegin('EggService_sayHello_args');
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

const EggService_sayHello_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined && args.success !== null) {
      this.success = args.success;
    }
  }
};
EggService_sayHello_result.prototype = {};
EggService_sayHello_result.prototype.read = function(input) {
  input.readStructBegin();
  while (true) {
    const ret = input.readFieldBegin();
    const fname = ret.fname;
    const ftype = ret.ftype;
    const fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid) {
      case 0:
        if (ftype == Thrift.Type.STRING) {
          this.success = input.readString();
        } else {
          input.skip(ftype);
        }
        break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

EggService_sayHello_result.prototype.write = function(output) {
  output.writeStructBegin('EggService_sayHello_result');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.STRING, 0);
    output.writeString(this.success);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

const EggServiceClient = exports.Client = function(output, pClass) {
  this.output = output;
  this.pClass = pClass;
  this._seqid = 0;
  this._reqs = {};
};
EggServiceClient.prototype = {};
EggServiceClient.prototype.seqid = function() { return this._seqid; };
EggServiceClient.prototype.new_seqid = function() { return this._seqid += 1; };
EggServiceClient.prototype.sayHello = function(callback) {
  this._seqid = this.new_seqid();
  if (callback === undefined) {
    const _defer = Q.defer();
    this._reqs[this.seqid()] = function(error, result) {
      if (error) {
        _defer.reject(error);
      } else {
        _defer.resolve(result);
      }
    };
    this.send_sayHello();
    return _defer.promise;
  }
  this._reqs[this.seqid()] = callback;
  this.send_sayHello();

};

EggServiceClient.prototype.send_sayHello = function() {
  const output = new this.pClass(this.output);
  output.writeMessageBegin('sayHello', Thrift.MessageType.CALL, this.seqid());
  const args = new EggService_sayHello_args();
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

EggServiceClient.prototype.recv_sayHello = function(input, mtype, rseqid) {
  const callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    const x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  const result = new EggService_sayHello_result();
  result.read(input);
  input.readMessageEnd();

  if (result.success !== null) {
    return callback(null, result.success);
  }
  return callback('sayHello failed: unknown result');
};
const EggServiceProcessor = exports.Processor = function(handler) {
  this._handler = handler;
}
;
EggServiceProcessor.prototype.process = function(input, output) {
  const r = input.readMessageBegin();
  if (this['process_' + r.fname]) {
    return this['process_' + r.fname].call(this, r.rseqid, input, output);
  }
  input.skip(Thrift.Type.STRUCT);
  input.readMessageEnd();
  const x = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN_METHOD, 'Unknown function ' + r.fname);
  output.writeMessageBegin(r.fname, Thrift.MessageType.EXCEPTION, r.rseqid);
  x.write(output);
  output.writeMessageEnd();
  output.flush();

}
;
EggServiceProcessor.prototype.process_sayHello = function(seqid, input, output) {
  const args = new EggService_sayHello_args();
  args.read(input);
  input.readMessageEnd();
  if (this._handler.sayHello.length === 0) {
    Q.fcall(this._handler.sayHello.bind(this._handler))
      .then(function(result) {
        const result_obj = new EggService_sayHello_result({ success: result });
        output.writeMessageBegin('sayHello', Thrift.MessageType.REPLY, seqid);
        result_obj.write(output);
        output.writeMessageEnd();
        output.flush();
      }, function(err) {
        let result;
        result = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin('sayHello', Thrift.MessageType.EXCEPTION, seqid);
        result.write(output);
        output.writeMessageEnd();
        output.flush();
      });
  } else {
    this._handler.sayHello(function(err, result) {
      let result_obj;
      if ((err === null || typeof err === 'undefined')) {
        result_obj = new EggService_sayHello_result((err !== null || typeof err === 'undefined') ? err : { success: result });
        output.writeMessageBegin('sayHello', Thrift.MessageType.REPLY, seqid);
      } else {
        result_obj = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN, err.message);
        output.writeMessageBegin('sayHello', Thrift.MessageType.EXCEPTION, seqid);
      }
      result_obj.write(output);
      output.writeMessageEnd();
      output.flush();
    });
  }
};