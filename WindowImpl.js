var EventDispatcher   = require('./EventDispatcher');

function WindowImpl() {
    EventDispatcher.call(this);
    this.width = 0;
    this.height = 0;
    this.fullScreen = false;
    this.pixelRatio = 1;
}

WindowImpl.prototype = Object.create(EventDispatcher.prototype);

WindowImpl.prototype.setSize = function(width,height,pixelRatio){};

WindowImpl.prototype.setFullScreen = function(enable){};

module.exports = WindowImpl;
