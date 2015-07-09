var isBrowser       = require('is-browser');
var plask           = isBrowser ? {} : require('plask');

var WindowPlask = {
    create: function(obj) {
        obj.settings.type = obj.settings.type || '3d';
        obj.settings.multisample = (obj.settings.multisample === undefined) ? true : obj.settings.multisample;
        obj._init = obj.init;
        obj.init = function() {
            this.framerate(60);
            obj._init();
        }
        plask.simpleWindow(obj);
    }
};

module.exports = WindowPlask;
