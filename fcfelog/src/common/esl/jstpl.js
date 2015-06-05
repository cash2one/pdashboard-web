/**
 * @file cross-domain template loader plugin
 */
define('jstpl', function (require) {
    var plugin = {
        load: function (resourceId, req, load, config) {
            require([resourceId], function (tpl) {
                var etpl = require('etpl');
                etpl.config({
                    namingConflict: 'ignore'
                });
                etpl.compile(tpl);
                load(tpl);
            });
        }
    }
    return plugin;
});