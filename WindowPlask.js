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

            this.on('mouseDown', function(e) {
                obj.settings.mouse.handleMouseDown({ x: e.x, y: e.y });
            });
            this.on('mouseUp', function(e) {
                obj.settings.mouse.handleMouseUp({ x: e.x, y: e.y });
            });
            this.on('mouseMoved', function(e) {
                obj.settings.mouse.handleMouseMove({ x: e.x, y: e.y });
            });
            this.on('mouseDragged', function(e) {
                obj.settings.mouse.handleMouseDrag({ x: e.x, y: e.y });
            });
            this.on('scrollWheel', function(e) {
                obj.settings.mouse.handleMouseScroll({ dx: e.dx, dy: e.dy });
            });


            obj._init();
        }
        plask.simpleWindow(obj);
    }
};

module.exports = WindowPlask;
