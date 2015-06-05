/**
 * @file performance展示页面 - mockservice服务
 * 暂时放弃本文件
 * @author Gu Shouchuang (gushouchuang@baidu.com)
 */
 define(function (require, exports, module) {
    var tpl = require('../../lib/tpl');
    var rand = require('../../lib/rand');
    var moment = require('moment');
    
    
    /**
    * return [Object] key为日期 value为众属性的不同分位值
    */
    
    module.exports = function (path, param) {
        var rel = tpl.success();
        rel.data = {};
        
        return rel;
    };
});