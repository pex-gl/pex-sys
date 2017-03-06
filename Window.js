var Context           = require('pex-context/Context');
var isPlask           = require('is-plask');
var EventDispatcher   = require('./EventDispatcher');
var WindowEvent       = require('./WindowEvent');
var ResourceLoader    = require('./ResourceLoader');
var WindowImpl        = isPlask ? require('./WindowImplPlask') : require('./WindowImplBrowser');
var Time              = require('./Time');
var Mouse             = require('./Mouse');
var MouseEvent        = require('./MouseEvent');
var Keyboard          = require('./Keyboard');
var KeyboardEvent     = require('./KeyboardEvent');

var current = null;

var ListenerCallbackMethod = {
    MOUSE_DOWN    : 'onMouseDown',
    MOUSE_UP      : 'onMouseUp',
    MOUSE_DRAG    : 'onMouseDrag',
    MOUSE_MOVE    : 'onMouseMove',
    MOUSE_SCROLL  : 'onMouseScroll',
    KEY_DOWN      : 'onKeyDown',
    KEY_PRESS     : 'onKeyPress',
    KEY_UP        : 'onKeyUp',
    WINDOW_RESIZE : 'onWindowResize'
};

function Window(){
    EventDispatcher.call(this);

    this._impl = null;

    this._ctx = null;
    this._resources = {};

    this._time = new Time();
    this._mouse = new Mouse();
    this._keyboard = new Keyboard();
}

Window.prototype = Object.create(EventDispatcher.prototype);
Window.prototype.constructor = Window;

Window.prototype.setSize = function(width,height,pixelRatio){
    this._impl.setSize(width,height,pixelRatio);

    this.dispatchEvent(new WindowEvent(WindowEvent.WINDOW_RESIZE, {
        width  : this.getWidth(),
        height : this.getHeight(),
        pixelRatio: this.getPixelRatio()
    }))
};

/**
 * Get current window (or canvas) size
 * @param {Array} array to put data into
 * @return {Array} [width, height]
 */
Window.prototype.getSize = function(out){
    out = out || new Array(2);
    out[0] = this._impl.width;
    out[1] = this._impl.height;
    return out;
};

/**
 * Get current window (or canvas) width in px
 * @return {Number}
 */
Window.prototype.getWidth = function(){
    return this._impl.width;
};

/**
 * Get current window (or canvas) height in px
 * @return {Number}
 */
Window.prototype.getHeight = function(){
    return this._impl.height;
};

/**
 * Get current window (or canvas) aspect ratio
 * @return {Number}
 */
Window.prototype.getAspectRatio = function(){
    return this._impl.width / this._impl.height;
};

Window.prototype.getPixelRatio = function(){
    return this._impl.pixelRatio;
};

/**
 * Get current window (or canvas) bounds
 * @param {Array} array to put data into
 * @return {Array} [0, 0, width, height]
 */
Window.prototype.getBounds = function(out){
    out = out || new Array(4);
    out[0] = out[1] = 0;
    out[2] = this.getWidth();
    out[3] = this.getHeight();
    return out;
};

Window.prototype.setFullScreen = function(enable){
    this._impl.setFullScreen(enable);
};

Window.prototype.isFullScreen = function(){
    return this._impl.fullScreen;
};

Window.prototype.toggleFullScreen = function(){
    this.isFullScreen() ? this.setFullScreen(false) : this.setFullScreen(true);
};

/**
 * Get WebGL Context instance associated with this window or canvas
 * @return {Context}
 */
Window.prototype.getContext = function(){
    return this._ctx;
};

/**
 * Get loaded resources
 * @return {Object} @see ResourceLoader
 */
Window.prototype.getResources = function(){
    return this._resources;
};

/**
 * Get Time instance associated with this window or canvas
 * @return {Time}
 */
Window.prototype.getTime = function(){
    return this._time;
};

/**
 * Get Mouse instance associated with this window or canvas
 * @return {Mouse}
 */
Window.prototype.getMouse = function(){
    return this._mouse;
};

/**
 * Get Keyboard instance associated with this window or canvas
 * @return {Keyboard}
 */
Window.prototype.getKeyboard = function(){
    return this._keyboard;
};

Window.prototype._addEventListener = Window.prototype.addEventListener;

/**
 * Helper method for registering multiple event listeners at once
 * @param  {Object|String} listenerObjOrType
 * @param  {Function} listenerObjOrType.onMouseDown
 * @param  {Function} listenerObjOrType.onMouseUp
 * @param  {Function} listenerObjOrType.onMouseDrag
 * @param  {Function} listenerObjOrType.onMouseMove
 * @param  {Function} listenerObjOrType.onMouseScroll
 * @param  {Function} listenerObjOrType.onKeyDown
 * @param  {Function} listenerObjOrType.onKeyPress
 * @param  {Function} listenerObjOrType.onKeyUp
 * @param  {Function} listenerObjOrType.onWindowResize
 * @param  {Function} [calback] callback function requried type is String
 */
Window.prototype.addEventListener = function(listenerObjOrType, method){
    if(method === undefined){
        if(listenerObjOrType === null || typeof listenerObjOrType !== 'object'){
            throw new Error('Invalid listener object.');
        }
        var mouse    = this._mouse;
        var keyboard = this._keyboard;
        for(var p in listenerObjOrType){
            if(typeof listenerObjOrType[p] !== 'function'){
                continue;
            }
            var func = listenerObjOrType[p];
            switch (p){
                case ListenerCallbackMethod.MOUSE_DOWN :
                    mouse.addEventListener(MouseEvent.MOUSE_DOWN,func.bind(listenerObjOrType));
                    break;
                case ListenerCallbackMethod.MOUSE_UP :
                    mouse.addEventListener(MouseEvent.MOUSE_UP,func.bind(listenerObjOrType));
                    break;
                case ListenerCallbackMethod.MOUSE_DRAG :
                    mouse.addEventListener(MouseEvent.MOUSE_DRAG,func.bind(listenerObjOrType));
                    break;
                case ListenerCallbackMethod.MOUSE_MOVE :
                    mouse.addEventListener(MouseEvent.MOUSE_MOVE,func.bind(listenerObjOrType));
                    break;
                case ListenerCallbackMethod.MOUSE_SCROLL:
                    mouse.addEventListener(MouseEvent.MOUSE_SCROLL,func.bind(listenerObjOrType));
                    break;
                case ListenerCallbackMethod.KEY_DOWN :
                    keyboard.addEventListener(KeyboardEvent.KEY_DOWN,func.bind(listenerObjOrType));
                    break;
                case ListenerCallbackMethod.KEY_PRESS :
                    keyboard.addEventListener(KeyboardEvent.KEY_PRESS,func.bind(listenerObjOrType));
                    break;
                case ListenerCallbackMethod.KEY_UP :
                    keyboard.addEventListener(KeyboardEvent.KEY_UP,func.bind(listenerObjOrType));
                    break;
                case ListenerCallbackMethod.WINDOW_RESIZE :
                    this.addEventListener(WindowEvent.WINDOW_RESIZE, func.bind(listenerObjOrType));
                    break;
            }
        }
        return;
    }

    this._addEventListener(listenerObjOrType,method);
};

/**
 * Create new window instance
 * @param  {Object} obj
 * @param  {Object} [obj.resources] - resources to load before init using @see ResourceLoader
 * @param  {Object} obj.init - Function called once after the resources finised loading and WebGL context has been created.
 * @param  {Object} obj.draw - Function called every frame
 */
Window.create = function(obj){
    var window = new Window();

    for(var p in obj){
        window[p] = obj[p];
    }

    window.resources = window.resources || {};

    var settings = obj.settings;

    settings.width      = settings.width  || 1280;
    settings.height     = settings.height || 720;
    settings.pixelRatio = settings.pixelRatio || 1;
    settings.fullScreen = settings.fullScreen || false;
    settings.debug      = settings.debug || false;

    function initWindowImpl(){
        var mouse = window._mouse;
        var keyboard = window._keyboard;

        //Wait with adding event listeners until the app initializes
        //This allow a GUI or an Arcball controller to get priority over e.g. onMouseDown
        function addWindowEventListeners() {
            if(window.onMouseDown){
                mouse.addEventListener(MouseEvent.MOUSE_DOWN, window.onMouseDown.bind(window));
            }
            if(window.onMouseUp){
                mouse.addEventListener(MouseEvent.MOUSE_UP, window.onMouseUp.bind(window));
            }
            if(window.onMouseMove){
                mouse.addEventListener(MouseEvent.MOUSE_MOVE, window.onMouseMove.bind(window));
            }
            if(window.onMouseDrag){
                mouse.addEventListener(MouseEvent.MOUSE_DRAG, window.onMouseDrag.bind(window));
            }
            if(window.onMouseScroll){
                mouse.addEventListener(MouseEvent.MOUSE_SCROLL, window.onMouseScroll.bind(window));
            }


            if(window.onKeyDown){
                keyboard.addEventListener(KeyboardEvent.KEY_DOWN, window.onKeyDown.bind(window));
            }
            if(window.onKeyPress){
                keyboard.addEventListener(KeyboardEvent.KEY_PRESS, window.onKeyPress.bind(window));
            }
            if(window.onKeyUp){
                keyboard.addEventListener(KeyboardEvent.KEY_UP, window.onKeyUp.bind(window));
            }
            if(window.onWindowResize) {
                window.addEventListener(WindowEvent.WINDOW_RESIZE, window.onWindowResize.bind(window));
            }
        }

        var impl = WindowImpl.create(window, settings);

        impl.addEventListener(WindowEvent.WINDOW_RESIZE, function(e) {
            window.dispatchEvent(new WindowEvent(WindowEvent.WINDOW_RESIZE, e))
        });

        impl.addEventListener(WindowEvent.WINDOW_READY, function() {
            // start counting from init, not from window creation
            window._time._restart()
            if (settings.debug) {
                try {
                    window.init();
                }
                catch (e) {
                    console.log('Window.init error:', e);
                    console.log('Window.init error stack:', e.stack);
                    if (isPlask) {
                        process.exit(-1)
                    }
                }
            }
            else {
                window.init()
            }
            addWindowEventListeners();
        }.bind(this));

        window._impl = impl;
    }

    ResourceLoader.load(window.resources, function(err, res){
        if(err){
            console.log('Window.create failed loading resources');
            console.log(err);
        }
        else {
            window._resources = res;
            delete window.resources;

            initWindowImpl();
        }
    });
};

module.exports = Window;
