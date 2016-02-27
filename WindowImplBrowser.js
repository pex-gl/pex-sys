//TODO: add retina support
//TODO: add resize event handling

var isBrowser   = require('is-browser');
var raf         = require('raf');

var WindowImpl  = require('./WindowImpl');
var Context     = require('pex-context/Context');

var WebGLContextNames = [
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

var isiOS9 = function() {
    var deviceAgent = navigator.userAgent.toLowerCase();
    return /(iphone|ipod|ipad).* os 9_/.test(deviceAgent);
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

function setCanvasSize(canvas,width,height,pixelRatio){
    pixelRatio = pixelRatio === undefined ? 1 : pixelRatio;

    canvas.width  = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width  = width  + 'px';
    canvas.style.height = height + 'px';
}

function WindowImplBrowser(){
    WindowImpl.call(this);
    this.canvas = null;
}

WindowImplBrowser.prototype = Object.create(WindowImpl.prototype);
WindowImplBrowser.prototype.constructor = WindowImplBrowser;

WindowImplBrowser.prototype.setSize = function(width,height,pixelRatio){
    pixelRatio = pixelRatio === undefined ? this.pixelRatio : pixelRatio;

    setCanvasSize(this.canvas, width, height, pixelRatio);
    this.width  = width * pixelRatio;
    this.height = height * pixelRatio;
    this.pixelRatio = pixelRatio;
};

WindowImplBrowser.prototype.setFullScreen = function(enable){
    var isDocumentFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;

    if((enable && this.fullScreen && isDocumentFullScreen) ||
        (!enable && !this.fullScreen && !isDocumentFullScreen)){
        return;
    }

    if(enable){
        var canvas = this.canvas;
        this.fullScreen = true;

        if(canvas.requestFullScreen){
            canvas.requestFullScreen();
        }
        else if(canvas.webkitRequestFullScreen){
            canvas.webkitRequestFullScreen();
        }
        else if(canvas.mozRequestFullScreen){
            canvas.mozRequestFullScreen();
        }
    }
    else {
        this.fullScreen = false;

        if(document.exitFullscreen){
            document.exitFullscreen();
        }
        else if(document.webkitExitFullscreen){
            document.webkitExitFullscreen();
        }
        else if(document.mozCancelFullScreen){
            document.mozCancelFullScreen();
        }
    }
};

WindowImplBrowser.create = function(windowPex,settings){
    var canvas  = settings.canvas || document.createElement('canvas');

    var width, height;
    var pixelRatio = settings.pixelRatio || 1;
    if(settings.fullScreen){
        width = isiOS9 ? document.documentElement.clientWidth : window.innerWidth;
        height = isiOS9 ? document.documentElement.clientHeight : window.innerHeight;
    }
    else {
        width  = settings.width;
        height = settings.height;
    }


    var impl = new WindowImplBrowser();
    impl.canvas = canvas;
    impl.setSize(width,height,pixelRatio);

    var mouse = windowPex._mouse;

    impl.canvas.addEventListener('mousedown', function(e) {
        mouse.handleMouseDown({
            x        : e.offsetX * pixelRatio,
            y        : e.offsetY * pixelRatio,
            altKey   : e.altKey,
            shiftKey : e.shiftKey,
            ctrlKey  : e.ctrlKey,
            metaKey  : e.metaKey
        });
    });

    impl.canvas.addEventListener('mouseup', function(e) {
        mouse.handleMouseUp({
            x        : e.offsetX * pixelRatio,
            y        : e.offsetY * pixelRatio,
            altKey   : e.altKey,
            shiftKey : e.shiftKey,
            ctrlKey  : e.ctrlKey,
            metaKey  : e.metaKey
        });
    });

    impl.canvas.addEventListener('mousemove', function(e) {
        mouse.handleMouseMove({
            x        : e.offsetX * pixelRatio,
            y        : e.offsetY * pixelRatio,
            altKey   : e.altKey,
            shiftKey : e.shiftKey,
            ctrlKey  : e.ctrlKey,
            metaKey  : e.metaKey
        });
    });

    var lastTouch = null;
    impl.canvas.addEventListener('touchstart', function(e) {
        var touches = Array.prototype.slice.call(e.touches).map(function(touch) {
            touch.x = touch.clientX * pixelRatio;
            touch.y = touch.clientY * pixelRatio;
            return touch;
        })
        lastTouch = touches[0];
        mouse.handleMouseDown({
            x        : touches[0].x,
            y        : touches[0].y,
            altKey   : false,
            shiftKey : false,
            ctrlKey  : false,
            metaKey  : false,
            touches  : touches
        });
        e.preventDefault();
        e.stopPropagation();
        return false;
    })

    impl.canvas.addEventListener('touchend', function(e) {
        var touches = Array.prototype.slice.call(e.touches).map(function(touch) {
            touch.x = touch.clientX * pixelRatio;
            touch.y = touch.clientY * pixelRatio;
            return touch;
        })
        mouse.handleMouseUp({
            x        : lastTouch.x,
            y        : lastTouch.y,
            altKey   : false,
            shiftKey : false,
            ctrlKey  : false,
            metaKey  : false,
            touches  : touches
        });
        lastTouch = null;
        e.preventDefault();
        e.stopPropagation();
        return false;
    })

    impl.canvas.addEventListener('touchmove', function(e) {
        var touches = Array.prototype.slice.call(e.touches).map(function(touch) {
            touch.x = touch.clientX * pixelRatio;
            touch.y = touch.clientY * pixelRatio;
            return touch;
        })
        mouse.handleMouseMove({
            x        : touches[0].x,
            y        : touches[0].y,
            altKey   : false,
            shiftKey : false,
            ctrlKey  : false,
            metaKey  : false,
            touches  : touches
        });
        e.preventDefault();
        e.stopPropagation();
        return false;
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
    });

    var keyboard = windowPex._keyboard;

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


    function drawLoop(now){
        windowPex._time._update(now);
        windowPex.draw();
        raf(drawLoop);
    }

    function go(){
        if (!settings.canvas) {
            //we careted new canvas, so we need to add it to the DOM
            document.body.appendChild(canvas);
        }

        windowPex._impl = impl;
        windowPex._impl.width  = width * pixelRatio;
        windowPex._impl.height = height * pixelRatio;
        windowPex._impl.pixelRatio = pixelRatio;

        if (settings.type == '2d') {
            windowPex._ctx = canvas.getContext('2d');
        }
        else {
            //TODO: add MSAA multisample support
            //TODO: add stencil option support
            //TODO: add premultipliedAlpha support
            //TODO: add preserveDrawingBuffer support
            var options = DefaultWebGLContextOptions;

            var gl = getWebGLContext(canvas,options);
            if(gl === null){
                throw new Error('WindowImplBrowser: No WebGL context is available.');
            }

            windowPex._ctx = new Context(gl);
        }

        windowPex.init();
        drawLoop(0);
    }

    if(!canvas.parentNode){
        //Window already loaded, or script inside body
        if (document.body) {
            go();
        }
        //Wait for window to load
        else {
            window.addEventListener('load',function(){
                go();
            },false);
        }
    }
    else{
        //Canvas element node already attached, ready to go
        go();
    }

    return impl;
};

module.exports = WindowImplBrowser;
