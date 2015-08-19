var Context         = require('pex-context/Context');
var isBrowser       = require('is-browser');
var WindowBrowser   = require('./WindowBrowser');
var WindowPlask     = require('./WindowPlask');
var ResourceLoader  = require('./ResourceLoader');
var Time            = require('./Time');
var Mouse           = require('./Mouse');
var MouseEvent      = require('./MouseEvent');
var Keyboard        = require('./Keyboard');
var KeyboardEvent   = require('./KeyboardEvent');

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
    this._ctx = null;
    this._resources = { };

    this._time = new Time();
    this._mouse = new Mouse();
    this._keyboard = new Keyboard();
}

Window.prototype.init = function(){};
Window.prototype.draw = function(){};

Window.prototype.getWidth = function(){
    return this._width;
};

Window.prototype.getHeight = function(){
    return this._height;
};

Window.prototype.getAspectRatio = function(){
    return this.getWidth() / this.getHeight();
};

Window.prototype.getSize = function(out){
    out = out || new Array(2);
    out[0] = this.getWidth();
    out[1] = this.getHeight();
    return out;
};

Window.prototype.getBounds = function(out){
    out = out || new Array(4);
    out[0] = out[1] = 0;
    out[2] = this.getWidth();
    out[3] = this.getHeight();
    return out;
};

Window.prototype.getContext = function(){
    return this._ctx;
};

Window.prototype.getResources = function(){
    return this._resources;
};

Window.prototype.getTime = function() {
    return this._time;
};

Window.prototype.getMouse = function() {
    return this._mouse;
};

Window.prototype.getKeyboard = function() {
    return this._keyboard;
};

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
                    break;
            }
        }
        return;
    }

    //window listener
};


Window.create = function(obj){
    var window = new Window();

    for (var p in obj) {
        window[p] = obj[p];
    }

    if (window.onMouseDown) window._mouse.addEventListener(MouseEvent.MOUSE_DOWN, window.onMouseDown.bind(window));
    if (window.onMouseUp) window._mouse.addEventListener(MouseEvent.MOUSE_UP, window.onMouseUp.bind(window));
    if (window.onMouseMove) window._mouse.addEventListener(MouseEvent.MOUSE_MOVE, window.onMouseMove.bind(window));
    if (window.onMouseDrag) window._mouse.addEventListener(MouseEvent.MOUSE_DRAG, window.onMouseDrag.bind(window));
    if (window.onMouseScroll) window._mouse.addEventListener(MouseEvent.MOUSE_SCROLL, window.onMouseScroll.bind(window));

    if (window.onKeyDown) window._keyboard.addEventListener(KeyboardEvent.KEY_DOWN, window.onKeyDown.bind(window));
    if (window.onKeyPress) window._keyboard.addEventListener(KeyboardEvent.KEY_PRESS, window.onKeyPress.bind(window));
    if (window.onKeyUp) window._keyboard.addEventListener(KeyboardEvent.KEY_UP, window.onKeyUp.bind(window));

    var winObj = {
        settings : {
            width      : window.settings.width || 1280,
            height     : window.settings.height || 720,
            fullscreen : window.settings.fullscreen || false,
            highdpi    : window.settings.highdpi || 1
        },
        time : window._time,
        input : {
            mouse    : window._mouse,
            keyboard : window._keyboard
        },
        init : function() {
            window._ctx = new Context(this.gl);
            window._width = this.width;
            window._height = this.height;
            window.init();
        },
        draw: window.draw.bind(window)
    };

    ResourceLoader.load(window.resources || {}, function(err, res) {
        if (err) {
            console.log('Window.create failed loading resources');
            console.log(err);
        }
        else {
            window._resources = res;

            if (isBrowser) {
                WindowBrowser.create(winObj);
            }
            else {
                WindowPlask.create(winObj);
            }
        }
    })
};

//FIXME: finish implementing or drop Window.getCurrent()
Window.getCurrent = function(){
    return current;
};

module.exports = Window;
