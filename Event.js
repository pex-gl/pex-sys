/**
 * Base Event class.
 * @param {String} type - The type
 * @param {Object} [data] - The data
 * @constructor
 * @class
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
 * @returns {Event} - copy of this event
 */
Event.prototype.copy = function(){
    var evt = new Event(this._type, this._data);
    evt.setSender(this._sender);
    return evt;
};

/**
 * Stop event from being passed to the subsequent event listenerers
 */
Event.prototype.stopPropagation = function(){
    this._stopPropagation = true;
};

/**
 * @return {EventDispatcher} - dispatcher of the event
 */
Event.prototype.getSender = function(){
    return this._sender;
};

/**
 * Used by the EventDispatcher that dispatches the event.
 * @param  {EventDispatcher} sender - dispatcher of the event
 */
Event.prototype.setSender = function(sender) {
    this._sender = sender;
};

/**
 * @return {String} type of the event
 */
Event.prototype.getType = function(){
    return this._type;
};

module.exports = Event;
