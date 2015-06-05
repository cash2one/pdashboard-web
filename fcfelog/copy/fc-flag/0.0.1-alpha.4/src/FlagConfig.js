/**
 * @file This file defines the flag's config format.
 *
 * @author: Lijie Chen(chenlijie@baidu.com), Leo Wang(wangkemiao@baidu.com)
 * Date: 2013-09-18
 */

define(function(require) {
    'use strict';

    /**
     * The config of a single flag, including the name, the value and the
     * description.
     * @constructor
     *
     * @param {string} name The name of the flag.
     * @param {string|boolean|number} value The value that supported in 3 types.
     * @param {string} description A paragraph of the descripiton about the
     *     flag.
     */
    var FlagConfig = function(name, value, description) {
        /**
         * The name of the flag.
         * @private
         * @type {string}
         */
        this._name = name;

        /**
         * The value of the flag.
         * @private
         * @type {string|boolean|number}
         */
        this._value = value;

        /**
         * The description of the flag.
         * @type {string}
         * @private
         */
        this._description = description;
    };

    /**
     * Retuns the name of the flag.
     * @return {string} the name of the flags
     */
    FlagConfig.prototype.getName = function() {
        return this._name;
    };

    /**
     * Retuns the value of the flag.
     * @return {string|boolean|number} the value of the flag
     */
    FlagConfig.prototype.getValue = function() {
        return this._value;
    };

    /**
     * Retuns true if the flag type is boolean.
     * @return {boolean} if the flag type is boolean
     */
    FlagConfig.prototype.isBoolean = function() {
        return (typeof this._value === 'boolean');
    };

    /**
     * Retuns the content of this flag config.
     * @return {string} the content of this flag config
     */
    FlagConfig.prototype.toString = function() {
        return [
            this._name, '=', this._value, ' Desc: ',
            this._description
        ].join('');
    };
    return FlagConfig;
});
