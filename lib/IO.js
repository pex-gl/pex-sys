var Platform = require('./Platform');
var plask = require('plask');
var path = require('path');
var fs = require('fs');

var PlaskIO = function() {
  function IO() {
  }

  IO.loadTextFile = function (file, callback) {
    var fullPath = path.resolve(IO.getWorkingDirectory(), file);
    if (!fs.existsSync(fullPath)) {
      if (callback) {
        return callback(null);
      }
    }
    var data = fs.readFileSync(fullPath, 'utf8');
    if (callback) {
      callback(data);
    }
  };

  IO.getWorkingDirectory = function () {
    return process.cwd();
  };

  IO.loadImageData = function (gl, texture, target, file, flip, callback) {
    var fullPath = path.resolve(IO.getWorkingDirectory(), file);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(texture.target, texture.handle);
    var canvas = plask.SkCanvas.createFromImage(fullPath);
    if (flip) {
      gl.texImage2DSkCanvas(target, 0, canvas);
    }
    else {
      gl.texImage2DSkCanvasNoFlip(target, 0, canvas);
    }
    if (callback) {
      callback(canvas);
    }
  };

  IO.watchTextFile = function (file, callback) {
    fs.watch(file, {}, function (event, fileName) {
      if (event == 'change') {
        var data = Node.fs.readFileSync(file, 'utf8');
        if (callback) {
          callback(data);
        }
      }
    });
  };

  IO.saveTextFile = function (file, data) {
    Node.fs.writeFileSync(file, data);
  };
  return IO;
};

var WebIO = function () {
  function IO() {
  }

  IO.getWorkingDirectory = function () {
    return '';
  };

  IO.loadTextFile = function (url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onreadystatechange = function (e) {
      if (request.readyState == 4) {
        if (request.status == 200) {
          if (callback) {
            callback(request.responseText);
          }
        } else {
          Log.error('WebIO.loadTextFile error : ' + request.statusText);
        }
      }
    };
    request.send(null);
  };

  IO.loadImageData = function (gl, texture, target, url, flip, callback) {
    var image = new Image();
    image.onload = function () {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(texture.target, texture.handle);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flip);
      gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      if (callback) {
        callback(image);
      }
    };
    image.src = url;
  };

  IO.watchTextFile = function () {
    console.log('Warning: WebIO.watch is not implemented!');
  };

  IO.saveTextFile = function (url, data, callback) {
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.onreadystatechange = function (e) {
      if (request.readyState == 4) {
        if (request.status == 200) {
          if (callback) {
            callback(request.responseText, request);
          }
        } else {
          Log.error('WebIO.saveTextFile error : ' + request.statusText);
        }
      }
    };
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send('data=' + encodeURIComponent(data));
  };

  return IO;
};

if (Platform.isPlask) module.exports = PlaskIO();
else if (Platform.isBrowser) module.exports = WebIO();