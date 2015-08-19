var isBrowser       = require('is-browser');
var plask           = isBrowser ? {} : require('plask');
var Screen          = require('./Screen');
var now             = require("performance-now");

var WindowPlask = {
    create: function(obj) {
        obj.settings.type = obj.settings.type || '3d';
        obj.settings.multisample = (obj.settings.multisample === undefined) ? true : obj.settings.multisample;
        //obj.settings.highdpi = Screen.getDevicePixelRatio();

        if (obj.settings.fullscreen) {
            obj.settings.width = Screen.getWidth();
            obj.settings.height = Screen.getHeight();
        }

        obj._init = obj.init;
        obj.init = function() {
            this.framerate(60);

            var mouse = obj.input.mouse;

            this.on('mouseDown', function(e) {
                mouse.handleMouseDown({
                    x        : e.x,
                    y        : e.y,
                    altKey   : e.option,
                    shiftKey : e.shift,
                    ctrlKey  : e.ctrl,
                    metaKey  : e.cmd
                });
            });
            this.on('mouseUp', function(e) {
                mouse.handleMouseUp({
                    x        : e.x,
                    y        : e.y,
                    altKey   : e.option,
                    shiftKey : e.shift,
                    ctrlKey  : e.ctrl,
                    metaKey  : e.cmd
                });
            });
            this.on('mouseMoved', function(e) {
                mouse.handleMouseMove({
                    x        : e.x,
                    y        : e.y,
                    altKey   : e.option,
                    shiftKey : e.shift,
                    ctrlKey  : e.ctrl,
                    metaKey  : e.cmd
                });
            });
            this.on('mouseDragged', function(e) {
                //mouse move events are not fired while dragging
                mouse.handleMouseMove({
                    x        : e.x,
                    y        : e.y,
                    altKey   : e.option,
                    shiftKey : e.shift,
                    ctrlKey  : e.ctrl,
                    metaKey  : e.cmd
                });
            });
            this.on('scrollWheel', function(e) {
                mouse.handleMouseScroll({
                    dx       : e.dx,
                    dy       : e.dy,
                    altKey   : e.option,
                    shiftKey : e.shift,
                    ctrlKey  : e.ctrl,
                    metaKey  : e.cmd
                });
            });

            var keyboard = obj.input.keyboard;

            this.on('keyDown', function(e) {
                keyboard.handleKeyDown({
                    str      : '',
                    keyCode  : e.keyCode,
                    altKey   : e.option,
                    shiftKey : e.shift,
                    ctrlKey  : e.ctrl,
                    metaKey  : e.cmd
                });
                keyboard.handleKeyPress({
                    str      : e.str,
                    keyCode  : e.keyCode,
                    altKey   : e.option,
                    shiftKey : e.shift,
                    ctrlKey  : e.ctrl,
                    metaKey  : e.cmd
                });
            })

            this.on('keyUp', function(e) {
                keyboard.handleKeyUp({
                    str      : '',
                    keyCode  : e.keyCode,
                    altKey   : e.option,
                    shiftKey : e.shift,
                    ctrlKey  : e.ctrl,
                    metaKey  : e.cmd
                });
            })

            obj._init();
        }

        obj._draw = obj.draw;
        obj.draw = function() {
            obj.time._update(now());
            obj._draw();
        }
        plask.simpleWindow(obj);
    }
};

module.exports = WindowPlask;
