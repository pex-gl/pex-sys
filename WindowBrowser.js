var isBrowser       = require('is-browser');
var Screen          = require('./Screen');

var requestAnimFrame    = null;

if (isBrowser) {
  requestAnimFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
      window.setTimeout(callback, 1000 / 60);
    };
  }();
}

var WebGLContextNames = [
    'experimental-webgl2',
    'webgl2',
    'experimental-webgl',
    'webgl'
];

var DefaultWebGLContextOptions = {
    alpha                           : true,
    depth                           : true,
    stencil                         : false,
    antialias                       : true,
    premultipliedAlpha              : true,
    preserveDrawingBuffer           : false,
    preferLowPowerToHighPerformance : false,
    failIfMajorPerformanceCaveat    : false
};

function getWebGLContext(canvas, contextOptions) {
    var gl = null;
    for(var i=0; i<WebGLContextNames.length; i++) {
        try {
            gl = canvas.getContext(WebGLContextNames[i], contextOptions);
            if (gl) {
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
    canvas = document.createElement('canvas');

    //TODO: add fullscreen / fullwindow support
    //TODO: add default width, height support

    var devicePixelRatio = Screen.getDevicePixelRatio();

    canvas.width = obj.settings.width;
    canvas.height = obj.settings.height;
    //canvas.style.width = obj.settings.width / devicePixelRatio + 'px';
    //canvas.style.height = obj.settings.height / devicePixelRatio + 'px';

    var mouse = obj.settings.mouse;

    canvas.addEventListener('mousedown', function(e) {
        mouse.handleMouseDown({ x: e.offsetX, y: e.offsetY });
    })

    canvas.addEventListener('mouseup', function(e) {
        mouse.handleMouseUp({ x: e.offsetX, y: e.offsetY });
    })

    canvas.addEventListener('mousemove', function(e) {
        mouse.handleMouseMove({ x: e.offsetX, y: e.offsetY });
    })

    var mouseWheelEvent = /Firefox/i.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel';
    //FIXME: horizontal scroll in the browser? What is .detail?
    window.addEventListener(mouseWheelEvent, function(e) {
        var dx = 0;
        var dy = e.wheelDelta / 10 || -e.detail / 10;
        obj.settings.mouse.handleMouseScroll({ dx: dx, dy: dy });
    })

    obj.width = canvas.width;
    obj.height = canvas.height;

    //TODO: add MSAA multisample support
    //TODO: add stencil option support
    //TODO: add premultipliedAlpha support
    //TODO: add preserveDrawingBuffer support
    var contextOptions = DefaultWebGLContextOptions;

    function drawloop() {
        obj.draw();
        requestAnimFrame(drawloop);
    }

    //TODO: add framerate support?
    function go() {
        obj.gl = getWebGLContext(canvas, contextOptions);

        if (obj.gl === null) {
            throw new Error('WindowBrowser: No WebGL context is available.');
        }

        obj.init();
        requestAnimFrame(drawloop);
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
