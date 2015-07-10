var isBrowser       = require('is-browser');
var plask           = isBrowser ? {} : require('plask');
var Screen          = require('./Screen');

var WindowPlask = {
    create: function(obj) {
        obj.settings.type = obj.settings.type || '3d';
        obj.settings.multisample = (obj.settings.multisample === undefined) ? true : obj.settings.multisample;
        //obj.settings.highdpi = Screen.getDevicePixelRatio();

        obj._init = obj.init;
        obj.init = function() {
            this.framerate(60);

            var mouse = obj.settings.mouse;

            this.on('mouseDown', function(e) {
                mouse.handleMouseDown({ x: e.x, y: e.y });
            });
            this.on('mouseUp', function(e) {
                mouse.handleMouseUp({ x: e.x, y: e.y });
            });
            this.on('mouseMoved', function(e) {
                mouse.handleMouseMove({ x: e.x, y: e.y });
            });
            this.on('mouseDragged', function(e) {
                //mouse move events are not fired while dragging
                mouse.handleMouseMove({ x: e.x, y: e.y });
            });
            this.on('scrollWheel', function(e) {
                mouse.handleMouseScroll({ dx: e.dx, dy: e.dy });
            });

            obj._init();
        }
        plask.simpleWindow(obj);
    }
};

module.exports = WindowPlask;
