var Platform = require('./Platform');
var BrowserWindow = require('./BrowserWindow');
var Time = require('./Time');
var merge = require('merge');
var plask = require('plask');

var DefaultSettings = {
  'width': 1280,
  'height': 720,
  'type': '3d',
  'vsync': true,
  'multisample': true,
  'fullscreen': false,
  'center': true,
  'hdpi': 1
};

var Window = {
  currentWindow: null,
  create: function(obj) {
    console.log('Window+');
    console.log('Platform', 'plask:' + Platform.isPlask, 'browser:' + Platform.isBrowser, 'ejecta:' + Platform.isEjecta);

    obj.settings = obj.settings || {};
    obj.settings = merge(DefaultSettings, obj.settings);

    obj.__init = obj.init;
    obj.init = function() {
      Window.currentWindow = this;
      obj.framerate(60);
      if (obj.__init) {
        obj.__init();
      }
    }

    obj.__draw = obj.draw;
    obj.draw = function() {
      Window.currentWindow = this;
      //FIXME: this will cause Time update n times, where n is number of Window instances opened
      Time.update();
      if (obj.__draw) {
        obj.__draw();
      }
    }

    if (Platform.isPlask) {
      plask.simpleWindow(obj);
    }
    else if (Platform.isBrowser || Platform.isEjecta) {
      BrowserWindow.simpleWindow(obj);
    }
  }
};

module.exports = Window;