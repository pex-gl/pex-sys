var io = require('pex-io');

/**
 * ResourceLoader class
 * @class
 */
var ResourceLoader = {
}

/**
 * Load provided resources
 * @param   {Object} resources - map of resources, see example
 * @param   {Function} callback function(err, resources), see example
 * @returns {Object}   - with same properties are resource list but resolved to the actual data
 *
 * @example
 * var glslify = require('glslify-promise');
 * var resources = {
 *     vert    : { glsl: glslify(__dirname + '/shader.vert') },
 *     frag    : { glsl: glslify(__dirname + '/shader.frag') },
 *     img     : { image: __dirname + '/tex.jpg'},
 *     hdrImg  : { binary: __dirname + '/tex.hdr'}
 *     data    : { json: __dirname + '/data.json'},
 *     hello   : { text: __dirname + '/hello.txt'}
 * };
 * Resource.load(resources, function(err, res) {
 * 	  res.vert   //{Promise}
 * 	  res.frag   //{Promise}
 * 	  res.img    //{Image} in a Browser or {SkCanvas} in Plask
 * 	  res.hdrImg //{ArrayBuffer}
 * 	  res.data   //{JSON}
 * 	  res.hello  //{String}
 * })
 */
ResourceLoader.load = function(resources, callback) {
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
                //Escape promise catch-all-errors sinkhole
                setTimeout(function() {
                    onLoaded(null, glslString);
                }, 1);
            }).catch(function(e) {
                onLoaded(e, null);
            })
        }
        else {
            onLoaded('ResourceLoader.load unknown resource type ' + Object.keys(res), null);
        }
    });

    if (resourceNames.length == 0) {
        onFinish();
    }
}



module.exports = ResourceLoader;
