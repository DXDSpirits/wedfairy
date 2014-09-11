/*
 * unicode issue on chunk data
 * http://cnodejs.org/topic/4f16442ccae1f4aa2700103d
 */

var BufferHelper = function() {
    this.buffers = [];
};

BufferHelper.prototype.concat = function(buffer) {
    this.buffers.push(buffer);
    return this;
};

BufferHelper.prototype.empty = function() {
    this.buffers = [];
    return this;
};

BufferHelper.prototype.toBuffer = function() {
    return Buffer.concat(this.buffers);
};

BufferHelper.prototype.toString = function(encoding) {
    return this.toBuffer().toString(encoding);
};

BufferHelper.prototype.load = function(stream, callback) {
    var that = this;
    stream.on('data', function(trunk) {
        that.concat(trunk);
    });
    stream.on('end', function() {
        callback(null, that.toBuffer());
    });
    stream.once('error', callback);
};

module.exports = BufferHelper;
