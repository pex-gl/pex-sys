var Event = require('./Event');
var isBrowser = require('is-browser');

function KeyboardEvent(type, data) {
    Event.call(this, type, data);
}

KeyboardEvent.prototype = Object.create(Event.prototype);
KeyboardEvent.prototype.constructor = KeyboardEvent;

KeyboardEvent.KEY_DOWN  = 'keydown';
KeyboardEvent.KEY_PRESS = 'keypress';
KeyboardEvent.KEY_UP    = 'keyup';

KeyboardEvent.VK_BACKSPACE  = isBrowser ?  8 :  51;
KeyboardEvent.VK_ENTER      = isBrowser ? 13 :  36;
KeyboardEvent.VK_SPACE      = isBrowser ? 32 :  49;
KeyboardEvent.VK_DELETE     = isBrowser ? 46 : 117;
KeyboardEvent.VK_TAB        = isBrowser ?  9 :  48;
KeyboardEvent.VK_ESC        = isBrowser ? 27 :  53;
KeyboardEvent.VK_UP         = isBrowser ? 38 : 126;
KeyboardEvent.VK_DOWN       = isBrowser ? 40 : 125;
KeyboardEvent.VK_LEFT       = isBrowser ? 37 : 123;
KeyboardEvent.VK_RIGHT      = isBrowser ? 39 : 124;

module.exports = KeyboardEvent;
