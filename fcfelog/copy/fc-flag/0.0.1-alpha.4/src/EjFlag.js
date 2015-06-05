/**
 * @file This file defines the EjFlag which is the interface to read the flag.
 * EjFlag means Ecom Js Flag.
 *
 * @author: Lijie Chen(chenlijie@baidu.com), Leo Wang(wangkemiao@baidu.com)
 * Date: 2013-09-18
 */

define(function(require) {
    'use strict';

    /**
     * EjFlag is the container of all the flags.
     * @constructor
     * @param {Array.<Object>} configs The array of the FlagSetting for
     *     for initialization.
     */
    var EjFlag = function(configs) {
        /**
         * The flags configuration.
         * @private
         * @type {Object}
         */
        this._config = {};

        // It's not necessary to depends on baidu's tangram lib here.
        // So I didn't use baidu.each.
        for (var i = 0, item; item = configs[i++];) {
            this._config[item.getName()] = item;
        }
    };

    /**
     * using debug config to override the current config
     * if keys or the type of value unmatched, this would throw a Error
     * @param {Object} configs debug config
     */
    EjFlag.prototype.debugOverride = function(configs) {
        for (var i = 0, item; item = configs[i++];) {
            var name = item.getName();
            if (!this._config[name]) {
                throw new Error('No such flag: ' + name);
            }
            else if (typeof this._config[name].getValue() !==
                typeof item.getValue()) {
                throw new Error('Flag type unmatch: ' + name);
            }

            this._config[name] = item;
        }
    };

    /**
     * Gets the config from the EjFlag by the given name.
     *
     * @param {string} name The name of the flag.
     * @return {?Object} The config object which is the instance of
     *     FlagSetting. Or null if failed.
     */
    EjFlag.prototype.getConfig = function(name) {
        if (!this._config[name]) {
            return null;
        }
        return this._config[name];
    };

    /**
     * Gets the flag's value from the EjFlag by the given name.
     *
     * @param {string} name The name of the flag.
     * @return {?number|boolean|string} The flag's value. Or null if failed.
     */
    EjFlag.prototype.get = function(name) {
        var config = this.getConfig(name);
        if (config) {
            return config.getValue();
        }
        return null;
    };

    /**
     * Checks if a certain flag is on or off. This only applies to boolean
     * flags. Otherwise it throws an exception.
     *
     * @param {string} name The name of the flag.
     * @return {boolean} Return true if the flag is on.
     */
    EjFlag.prototype.isOn = function(name) {
        var config = this.getConfig(name);
        if (config && config.isBoolean()) {
            return config.getValue();
        }
        throw new Error('Called EjFlag.isOn on an inappropriate flag: ' + name);
    };

    /**
     * Runs a callback if the flag is on.
     *
     * @param {string} name The name of the flag.
     * @param {Function} callback The callback to run when flag is on.
     * @param {Object} context The 'this' of the callback.
     */
    EjFlag.prototype.whenOn = function(name, callback, context) {
        if (this.isOn(name)) {
            callback.apply(context || this);
        }
    };

    /**
     * Runs a callback if the flag is off.
     *
     * @param {string} name The name of the flag.
     * @param {Function} callback The callback to run when flag is off.
     * @param {Object} context The 'this' of the callback.
     */
    EjFlag.prototype.whenOff = function(name, callback, context) {
        if (!this.isOn(name)) {
            callback.apply(context || this);
        }
    };

    /**
     * Runs either callback depending on the flag's status.
     *
     * @param {string} name The name of the flag.
     * @param {Function} onCallback The callback to run when flag is on.
     * @param {Function} offCallback The callback to run when flag is off.
     * @param {Object} context The 'this' of the callback.
     */
    EjFlag.prototype.whenOnElse = function(
        name, onCallback, offCallback, context) {
        if (this.isOn(name)) {
            onCallback.apply(context || this);
        }
        else {
            offCallback.apply(context || this);
        }
    };

    /**
     * Gets the content of all the flags in this EjFlag.
     *
     * @return {string} The content of the EjFlag.
     */
    EjFlag.prototype.toString = function() {
        var content = [];
        for (var flagName in this._config) {
            if (this._config.hasOwnProperty(flagName)) {
                content.push(this._config[flagName].toString());
            }
        }
        return content.join('\n');
    };

    return EjFlag;
});
