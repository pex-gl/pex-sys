var Context         = require('pex-context/Context');
var isBrowser       = require('is-browser');
var WindowBrowser   = require('./WindowBrowser');
var WindowPlask     = require('./WindowPlask');
var ResourceLoader  = require('./ResourceLoader');
var Mouse           = require('./Mouse');
var Keyboard        = require('./Keyboard');

var current = null;

function Window(){
    this._ctx = null;
    this._resources = { };
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

Window.prototype.getMouse = function() {
    return this._mouse;
};

Window.prototype.getKeyboard = function() {
    return this._keyboard;
};

Window.create = function(obj){
    var window = new Window();

    for (var p in obj) {
        window[p] = obj[p];
    }

    var winObj = {
        settings: {
            width    : window.settings.width || 1280,
            height   : window.settings.height || 720,
            mouse    : window._mouse,
            keyboard : window._keyboard
        },
        init: function() {
            window._ctx = new Context(this.gl);
            window._width = this.width;
            window._height = this.height;
            window.init();
        },
        draw: window.draw.bind(window)
    }

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

Window.getCurrent = function(){
    return current;
};

module.exports = Window;
