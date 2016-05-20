var plask      = require('plask');
var now        = require("performance-now");
var WindowImpl = require('./WindowImpl');
var WindowEvent = require('./WindowEvent');
var Context    = require('pex-context/Context');
var omgcanvas  = require('omgcanvas');
var WebGLDebugUtils   = require('webgl-debug');

var Screen = require('./Screen');

function WindowImplPlask(){
    WindowImpl.call(this);

    this.plaskObj = null;
    this.title = '';
}

WindowImplPlask.prototype = Object.create(WindowImpl.prototype);
WindowImplPlask.prototype.constructor = WindowImplPlask;

WindowImplPlask.prototype.setFullScreen = function(){
    this.fullScreen = !this.fullScreen;
    this.plaskObj.setFullscreen(this.fullScreen);
};

WindowImplPlask.create = function(windowPex,settings){
    settings.type = settings.type || '3d';
    settings.multisample = settings.multisample === undefined ? true : settings.multisample;
    settings.title = settings.title || 'pex';
    settings.fullscreen = settings.fullScreen || false;

    var pixelRatio = settings.pixelRatio = settings.highdpi = settings.pixelRatio || 1;

    if(settings.fullScreen) {
      settings.width = Screen.getWidth();
      settings.height = Screen.getHeight();
    }
    settings.width *= pixelRatio;
    settings.height *= pixelRatio;

    var impl = new WindowImplPlask();

    var obj = {};
    obj.settings = settings;
    obj.init = function(){
        this.framerate(60);

        var mouse = windowPex._mouse;

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

        var keyboard = windowPex._keyboard;

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
        });

        this.on('keyUp', function(e) {
            keyboard.handleKeyUp({
                str      : '',
                keyCode  : e.keyCode,
                altKey   : e.option,
                shiftKey : e.shift,
                ctrlKey  : e.ctrl,
                metaKey  : e.cmd
            });
        });

        impl.plaskObj = this;
        impl.width    = this.settings.width;
        impl.height   = this.settings.height;
        impl.pixelRatio = this.settings.pixelRatio;

        if (settings.type == '2d') {
            windowPex._ctx = new omgcanvas.CanvasContext(this.canvas);
        }
        else {
            if (settings.debug) {
                function throwOnGLError(err, funcName, args) {
                    throw new Error(WebGLDebugUtils.glEnumToString(err) + " was caused by call to " + funcName);
                };
                this.gl = WebGLDebugUtils.makeDebugContext(this.gl, throwOnGLError);
            }
            windowPex._ctx  = new Context(this.gl);
        }

        impl.dispatchEvent(new WindowEvent(WindowEvent.WINDOW_READY, {}));
    };

    obj.draw = function(){
        windowPex._time._update(now());
        if (settings.debug) {
            try {
                windowPex.draw();
            }
            catch(e) {
                console.log(e);
                console.log(e.stack);
                process.exit(-1);
            }
        }
        else {
            windowPex.draw()
        }
    };

    setTimeout(function() {
        plask.simpleWindow(obj);
    }, 1);

    return impl;
};

module.exports = WindowImplPlask;
