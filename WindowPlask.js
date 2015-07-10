var isBrowser       = require('is-browser');
var plask           = isBrowser ? {} : require('plask');
var Screen          = require('./Screen');

var WindowPlask = {
    create: function(obj) {
        obj.settings.type = obj.settings.type || '3d';
        obj.settings.multisample = (obj.settings.multisample === undefined) ? true : obj.settings.multisample;
        obj.settings.highdpi = Screen.getDevicePixelRatio();

        obj._init = obj.init;
        obj.init = function() {
            this.framerate(60);

            this.on('mouseMoved', function(e) {
                obj.settings.mouse.handleMouseMove({ x: e.x, y: e.y });
            })

            obj._init();
        }
        plask.simpleWindow(obj);
    }
};

module.exports = WindowPlask;
