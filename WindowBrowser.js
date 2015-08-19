var isBrowser       = require('is-browser');
var raf             = require('raf');
var Screen          = require('./Screen');

var WebGLContextNames = [
    'experimental-webgl',
    'webgl'
];

var WebGL2ContextNames = [
    'experimental-webgl2',
    'webgl2',
    'experimental-webgl',
    'webgl'
];

var DefaultWebGLContextOptions = {
    alpha                           : false,
    depth                           : true,
    stencil                         : false,
    antialias                       : true,
    premultipliedAlpha              : true,
    preserveDrawingBuffer           : false,
    preferLowPowerToHighPerformance : false,
    failIfMajorPerformanceCaveat    : false
};

function getWebGLContext(canvas, contextOptions, contextNames) {
    var gl = null;
    for(var i=0; i<WebGLContextNames.length; i++) {
        try {
            gl = canvas.getContext(contextNames[i], contextOptions);
            if (gl) {
                console.log(contextNames[i])
                break;
            }
        }
        catch (err) {
        }
    }
    return gl;
}

function createBrowserWindow(obj) {
    //TODO: add option to provide canvas reference
    var canvas = document.createElement('canvas');

    //TODO: add fullscreen / fullwindow support
    //TODO: add default width, height support

    var devicePixelRatio = Screen.getDevicePixelRatio();

    canvas.width = obj.settings.width;
    canvas.height = obj.settings.height;

    if (obj.settings.fullscreen) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.style.margin = '0';
    }
    //canvas.style.width = obj.settings.width / devicePixelRatio + 'px';
    //canvas.style.height = obj.settings.height / devicePixelRatio + 'px';

    var mouse = obj.input.mouse;

    canvas.addEventListener('mousedown', function(e) {
        mouse.handleMouseDown({
            x        : e.offsetX,
            y        : e.offsetY,
            altKey   : e.altKey,
            shiftKey : e.shiftKey,
            ctrlKey  : e.ctrlKey,
            metaKey  : e.metaKey
        });
    })

    canvas.addEventListener('mouseup', function(e) {
        mouse.handleMouseUp({
            x        : e.offsetX,
            y        : e.offsetY,
            altKey   : e.altKey,
            shiftKey : e.shiftKey,
            ctrlKey  : e.ctrlKey,
            metaKey  : e.metaKey
        });
    })

    canvas.addEventListener('mousemove', function(e) {
        mouse.handleMouseMove({
            x        : e.offsetX,
            y        : e.offsetY,
            altKey   : e.altKey,
            shiftKey : e.shiftKey,
            ctrlKey  : e.ctrlKey,
            metaKey  : e.metaKey
        });
    })

    var mouseWheelEvent = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel';
    //FIXME: horizontal scroll in the browser? What is .detail?
    window.addEventListener(mouseWheelEvent, function(e) {
        var dx = 0;
        var dy = e.wheelDelta / 10 || -e.detail / 10;
        mouse.handleMouseScroll({
            dx       : dx,
            dy       : dy,
            altKey   : e.altKey,
            shiftKey : e.shiftKey,
            ctrlKey  : e.ctrlKey,
            metaKey  : e.metaKey
        });
    })

    var keyboard = obj.input.keyboard;

    window.addEventListener('keydown', function(e) {
        keyboard.handleKeyDown({
            str      : '',
            keyCode  : e.keyCode,
            altKey   : e.altKey,
            shiftKey : e.shiftKey,
            ctrlKey  : e.ctrlKey,
            metaKey  : e.metaKey
        });
    });

    window.addEventListener('keypress', function(e) {
        keyboard.handleKeyPress({
            str      : String.fromCharCode(e.charCode),
            keyCode  : e.keyCode,
            altKey   : e.altKey,
            shiftKey : e.shiftKey,
            ctrlKey  : e.ctrlKey,
            metaKey  : e.metaKey
        });
    });

    window.addEventListener('keyup', function(e) {
        keyboard.handleKeyUp({
            str      : '',
            keyCode  : e.keyCode,
            altKey   : e.altKey,
            shiftKey : e.shiftKey,
            ctrlKey  : e.ctrlKey,
            metaKey  : e.metaKey
        });
    });

    obj.width = canvas.width;
    obj.height = canvas.height;

    //TODO: add MSAA multisample support
    //TODO: add stencil option support
    //TODO: add premultipliedAlpha support
    //TODO: add preserveDrawingBuffer support
    var contextOptions = DefaultWebGLContextOptions;

    function drawloop(now) {
        obj.time._update(now);
        obj.draw();
        raf(drawloop);
    }

    //TODO: add framerate support?
    function go() {
        obj.gl = getWebGLContext(canvas, contextOptions, obj.settings.webgl2 ? WebGL2ContextNames : WebGLContextNames);

        if (obj.gl === null) {
            throw new Error('WindowBrowser: No WebGL context is available.');
        }

        obj.init();
        raf(drawloop);
    }

    if (!canvas.parentNode) {
        //Window already loaded, or script inside body
        if (document.body) {
            document.body.appendChild(canvas);
            go();
        }
        else {
            //Wait for window to load
            window.addEventListener('load', function() {
                document.body.appendChild(canvas);
                go();
            }, false);
        }
    }
    else {
        //Canvas element node already attached, ready to go
        go();
    }
}

var WindowBrowser = {
    create : createBrowserWindow
}

module.exports = WindowBrowser;
