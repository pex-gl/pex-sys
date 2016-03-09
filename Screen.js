var isPlask  = require('is-plask');
var plask    = isPlask ? require('plask') : {};

/**
 * Singleton for retrieving information about available screens / displays
 */
var Screen = {
    /**
     * @return {Number} number of screens
     */
    getNumScreens: function() {
        if (isPlask) {
            return plask.Window.screensInfo().length;
        }
        else {
            return 1;
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

        if (isPlask) {
            return plask.Window.screensInfo()[screenId].width;
        }
        else {
            return window.innerWidth;
        }
    },
    /**
     *
     * @param  {Number} screenId - id of the screen we query about
     * @return {Number}          - height of the given screen in px
     */
    getHeight: function(screenId) {
        screenId = screenId || 0;

        if (isPlask) {
            return plask.Window.screensInfo()[screenId].height;
        }
        else {
            return window.innerHeight;
        }
    },
    /**
     *
     * @param  {Number} screenId - id of the screen we query about
     * @return {Number}          - device pixel ratio of the given screen (e.g. 2 for retina)
     */
    getDevicePixelRatio: function(screenId) {
        screenId = screenId || 0;

        if (isPlask) {
            return plask.Window.screensInfo()[screenId].highdpi;
        }
        else {
            return window.devicePixelRatio;
        }
    }
};


module.exports = Screen;
