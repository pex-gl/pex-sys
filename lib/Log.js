function Log() {
}

Log.message = function(msg) {
  if (console !== undefined) {
    console.log(msg);
  }
};

Log.error = function(msg) {
  if (console !== undefined) {
    console.log('ERROR: ' + msg);
  }
};

module.exports = Log;