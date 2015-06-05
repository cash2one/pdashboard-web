/**
 * @file fc-component-ria 提供可以跟RIA整合的component模式 主入口文件
 * Basic support：Chrome、Firefox3.5+、Opera10+、Safari3.2+、IE8+
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    'use strict';

    var _ = require('underscore');
    var fc = require('fc-core');
    var Promise = require('fc-core/Promise');

    /**
     * fc-component-ria 提供可以跟RIA整合的component模式
     */
    var component = {
        version: '0.0.1.alpha.7',

        /**
         * 已经注册了的Components
         */
        registeredComponents: [],

        /**
         * 初始化某个区域的component
         * @param {HtmlElement | string=} container 容器
         * @param {Object=} options 配置
         * @param {meta.Model} options.model 模板的数据
         * @return {Promise} 异步执行状态
         */
        init: function (container, options) {
			// debugger
            if (typeof container === 'string') {
                container = document.querySelector(container);
            }
            if (!container) {
                container = document.documentElement;
            }
            options = options || {};
			
            var componentList = require('./analyser').analyse(container);
            var state = [];
            // 模板替换
            _.each(componentList, function (component) {

                var domList = container.querySelectorAll(component.name);
                if (component.action) {
                    state.push(
                        initCustomedComponent(component, domList, options)
                    );
                }
                else {
                    initBasicComponent(component, domList, options);
                }
            });

            if (state.length > 0) {
                return Promise.all(state);
            }
            return Promise.resolve();
        }
    };

    function initCustomedComponent(component, domList, options) {
        return require('fc-core/Promise').require([component.action]).then(
            function (ComponentAction) {
                _.each(domList, function (eachDom) {
                    if (options.componentContext && options.componentContext.get(component.name)) {
                        var exist = options.componentContext.get(component.name);
                        options.componentContext.remove(exist);
                        exist.dispose();
                        exist = null;
                    }

                    var instance = new ComponentAction(
                        _.chain({})
                            .extend(options)
                            .extend({
                                container: eachDom,
                                template: component.template.innerHTML,
                                name: component.name
                            })
                            .value()
                    );

                    instance.enter();

                });
            }
        ).catch(function (e) {
            fc.util.processError(e);
        });
    }

    function initBasicComponent(component, domList, options) {
        _.each(domList, function (target) {
            target.innerHTML = component.renderer(options.model.dump ? options.model.dump() : {});
        });
    }

    return component;
});
