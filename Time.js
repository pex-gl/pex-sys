function Time() {
    this._start = 0;
    this._now = 0;
    this._prev = 0;
    this._delta = 0;
    this._deltaSeconds = 0;
    this._elapsedSeconds = 0;
    this._frames = 0;
    this._stopped = false;

    this._fpsUpdateFrequency = 3000; //3s
    this._fpsFrames = 0;
    this._fpsTime = 0;
    this._fps = 0;
}

Time.prototype._update = function(now) {
    this._prev = this._now;
    this._now = now;
    this._delta = this._now - this._prev;

    this._deltaSeconds = this._delta / 1000;
    this._elapsedSeconds = (this._now - this._start) / 1000;

    this._frames++;

    if (this._fpsTime > this._fpsUpdateFrequency) {
        this._fps = Math.floor(this._fpsFrames / (this._fpsTime / 1000)*10)/10;
        this._fpsTime = 0;
        this._fpsFrames = 0;
    }
    else {
        this._fpsTime += this._delta;
        this._fpsFrames++;
    }
}

Time.prototype._stop = function() {
    this._stopped = true;
    this._delta = 0;
    this._deltaSeconds = 0;

    this._fpsFrames = 0;
    this._fpsTime = 0;
    this._fps = 0;
}

Time.prototype._restart = function(now) {
    this._start = now;
    this._now = now;
    this._prev = now;
    this._delta = 0;
    this._frames = 0;
    this._stopped = false;
    this._deltaSeconds = 0;
    this._elapsedSeconds = 0;

    this._fpsFrames = 0;
    this._fpsTime = 0;
    this._fps = 0;
}

Time.prototype._resume = function(now) {
    this._now = now;
    this._prev = now;
    this._delta = 0;
    this._stopped = false;

    this._fpsFrames = 0;
    this._fpsTime = 0;
    this._fps = 0;
}

Time.prototype.getDelta = function() {
    return this._delta;
}

Time.prototype.getDeltaSeconds = function() {
    return this._deltaSeconds;
}

//FIXME: cache that?
Time.prototype.getElapsedSeconds = function() {
    return this._elapsedSeconds;
}

Time.prototype.getElapsedFrames = function() {
    return this._frames;
}

Time.prototype.getFPS = function() {
    return this._fps;
}

module.exports = Time;
