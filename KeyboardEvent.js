var Event = require('./Event');

function KeyboardEvent(type, data) {
    Event.call(this, type, data);
}

KeyboardEvent.prototype = Object.create(Event.prototype);
KeyboardEvent.prototype.constructor = KeyboardEvent;

KeyboardEvent.KEY_DOWN  = 'keydown';
KeyboardEvent.KEY_PRESS = 'keypress';
KeyboardEvent.KEY_UP    = 'keyup';

module.exports = KeyboardEvent;
