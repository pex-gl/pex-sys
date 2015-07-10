/**
 * Base class Event.
 * @param {EventDispatcher} sender - The sender
 * @param {String} type - The type
 * @param {Object} [data] - The data
 * @constructor
 */
function Event(sender,type,data){
    this.sender = sender;
    this.type   = type;
    this.data   = data;

    this._stopPropagation = false;
}
/**
 * Returns a copy of the event.
 * @returns {Event}
 */

Event.prototype.copy = function(){
    return new Event(this.sender,this.type,this.data);
};

Event.prototype.stopPropagation = function(){
    this._stopPropagation = true;
};

module.exports = Event;
