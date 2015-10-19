var EventDispatcher = require('./EventDispatcher');

function WindowImpl(){
    this.width = 0;
    this.height = 0;
    this.fullScreen = false;
    this.pixelRatio = 1;
}

WindowImpl.prototype.setSize = function(width,height,pixelRatio){};

WindowImpl.prototype.setFullScreen = function(enable){};

module.exports = WindowImpl;
