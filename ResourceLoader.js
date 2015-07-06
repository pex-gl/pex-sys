var io = require('pex-io');

function load(resources, callback) {
    var results = {};
    var errors = {};
    var hadErrors = false;

    //TODO: use `async` module instead?
    var loadedResources = 0;
    var resourceNames = Object.keys(resources);
    var numResources = resourceNames.length;

    function onFinish() {
        if (hadErrors) {
            callback(errors, null);
        }
        else {
            callback(null, resources);
        }
    }

    resourceNames.forEach(function(name) {
        function onLoaded(err, data) {
            if (err) {
                hadErrors = true;
                errors[name] = err;
            }
            else {
                resources[name] = data;
            }

            if (++loadedResources == numResources) {
                onFinish();
            }
        }

        var res = resources[name];
        if (res.image) {
            io.loadImage(res.image, onLoaded);
        }
        else if (res.text) {
            io.loadText(res.text, onLoaded);
        }
        else if (res.json) {
            io.loadJSON(res.json, onLoaded);
        }
        else if (res.binary) {
            io.loadBinary(res.binary, onLoaded);
        }
        else if (res.glsl) {
            res.glsl.then(function(glslString) {
                onLoaded(null, glslString);
            }).catch(function(e) {
                onLoaded(e, null);
            })
        }
        else {
            onLoaded('ResourceLoader.load unknown resource type ' + Object.keys(res), null);
        }
    });
}

var ResourceLoader = {
    load: load
}

module.exports = ResourceLoader;
