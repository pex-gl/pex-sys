var Context         = require('pex-context/Context');
var isBrowser       = require('is-browser');
var plask           = isBrowser ? {} : require('plask');
var WindowBrowser   = require('./WindowBrowser');
var ResourceLoader  = require('./ResourceLoader');

var current = null;

function Window(){
    this._ctx = null;
}

Window.prototype.init = function(){};
Window.prototype.draw = function(){};

Window.prototype.getSize = function(out){
    out = out || new Array(2);
    out[0] = this.width;
    out[1] = this.height;
    return out;
};

Window.prototype.getWidth = function(){
    return this.width;
};

Window.prototype.getHeight = function(){
    return this.height;
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

//TODO: add default window options
Window.create = function(obj){
    var window = new Window();
    for (var p in obj) {
        window[p] = obj[p];
    }

    current = window;

    if (obj.settings.type == '3d') {
        //sure...
        var init = window.init;
        window.init = function() {
            if (!isBrowser) {
                this.framerate(60);
            }
            this._ctx = new Context(this.gl);
            delete this.gl;
            init.call(this);
        };
        var draw = window.draw;
        window.draw = function () {
            current = window;
            //this is were plask simplewindow should be unrolled
            draw.call(this);
        };
    }
    else {
        //other context
    }

    //defaults
    if (window.settings.multisample === undefined) {
        window.settings.multisample = true;
    }

    //TODO: ugly!
    function start() {
        if (isBrowser) {
            WindowBrowser.simpleWindow(window);
        }
        else { //assuming Plask
            plask.simpleWindow(window);
        }
    }

    if (window.resources) {
        ResourceLoader.load(window.resources, function(err, res) {
            if (err) {
                console.log('Window.create failed loading resources');
                console.log(err);
            }
            else {
                window.getResources = function() {
                    return res;
                }
                start();
            }
        })
    }
    else {
        start();
    }


};

Window.getCurrent = function(){
    return current;
};

module.exports = Window;
