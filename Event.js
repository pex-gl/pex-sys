/**
 * Base class Event.
 * @param {EventDispatcher} sender - The sender
 * @param {String} type - The type
 * @param {Object} [data] - The data
 * @constructor
 */
function Event(type, data){
    this._sender = null;
    this._type   = type;
    this._data   = data;

    for(var prop in data) {
        this[prop] = data[prop];
    }

    this._stopPropagation = false;
}
/**
 * Returns a copy of the event.
 * @returns {Event}
 */

Event.prototype.copy = function(){
    return new Event(this._sender, this._type, this._data);
};

Event.prototype.stopPropagation = function(){
    this._stopPropagation = true;
};

Event.prototype.getSender = function(){
    return this._sender;
};

Event.prototype.setSender = function(sender) {
    this._sender = sender;
};

Event.prototype.getType = function(){
    return this._type;
};


module.exports = Event;
