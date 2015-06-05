/**
 * @file performance数据展示service
 * @author Gu Shouchuang(gushouchuang@baidu.com)
 */

define(function (require, exports) {
    var ajax = require('fc-ajax');
    var ajaxConfig = require('fc-ajax/config');
    
    ajaxConfig.url = 'request.ajax';
    ajaxConfig.method = 'GET';
    /**
     * service常量配置
     */
    var AJAX_DEFAULT = {
        /**
        * 获取可选计划的单元列表
        */
        GET_PERFORMANCE_DATA: {
            path: 'performance/GET/data',
            params: {}
        }
    };
   
    /**
    * 获取一段时间内的performance数据
    *
    * @param {Object=} params 请求参数
    * @returns {Deferred.promise}
    */
    exports.getPerformanceData = function (params) {
        var defaultOptions = AJAX_DEFAULT.GET_PERFORMANCE_DATA;
        params = $.extend(true, {}, defaultOptions.params, params);
        return ajax.request(defaultOptions.path, params);
    };
});