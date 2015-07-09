var isBrowser  = require('is-browser');
var plask      = isBrowser ? {} : require('plask');


var Screen = {
    getNumScreens: function() {
        if (isBrowser) {
            return 1;
        }
        else {
            return plask.Window.screensInfo().length;
        }

        return this._screens;
    },
    getWidth: function(screenId) {
        screenId = screenId || 0;

        var dpr = this.getDevicePixelRatio(screenId);

        if (isBrowser) {
            return dpr * window.innerWidth;
        }
        else {
            return dpr * plask.Window.screensInfo()[screenId].width;
        }
    },
    getHeight: function(screenId) {
        screenId = screenId || 0;

        var dpr = this.getDevicePixelRatio(screenId);

        if (isBrowser) {
            return dpr * window.innerHeight;
        }
        else {
            return dpr * plask.Window.screensInfo()[screenId].height;
        }
    },
    getDevicePixelRatio: function(screenId) {
        screenId = screenId || 0;

        if (isBrowser) {
            return window.devicePixelRatio;
        }
        else {
            return plask.Window.screensInfo()[screenId].highdpi;
        }
    }
};


module.exports = Screen;
