var isBrowser  = require('is-browser');
var plask      = isBrowser ? {} : require('plask');

/**
 * Singleton for retrieving information about available screens / displays
 */
var Screen = {
    /**
     * @return {Number} number of screens
     */
    getNumScreens: function() {
        if (isBrowser) {
            return 1;
        }
        else {
            return plask.Window.screensInfo().length;
        }

        return this._screens;
    },
    /**
     *
     * @param  {Number} screenId - id of the screen we query about
     * @return {Number}          - width of the given screen in px
     */
    getWidth: function(screenId) {
        screenId = screenId || 0;

        if (isBrowser) {
            return window.innerWidth;
        }
        else {
            return plask.Window.screensInfo()[screenId].width;
        }
    },
    /**
     *
     * @param  {Number} screenId - id of the screen we query about
     * @return {Number}          - height of the given screen in px
     */
    getHeight: function(screenId) {
        screenId = screenId || 0;

        if (isBrowser) {
            return window.innerHeight;
        }
        else {
            return plask.Window.screensInfo()[screenId].height;
        }
    },
    /**
     *
     * @param  {Number} screenId - id of the screen we query about
     * @return {Number}          - device pixel ratio of the given screen (e.g. 2 for retina)
     */
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
