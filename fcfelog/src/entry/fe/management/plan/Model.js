/**
 * @file performance展示页面 - Model定义
 * @author Gu Shouchuang (gushouchuang@baidu.com)
 */

define(function (require) {
    var UIModel = require('fc-view/mvc/EntryModel');
    var _ = require('underscore');

    var service = require('./service');
    var util = require('common/util');
    var moment = require('moment');
    
    var PerformanceDataLoader = require('./dataLoader/PerformanceDataLoader');
    /**
     * performance展示页面 - Model定义
     *
     * @class ?
     * @extends {UIModel}
     * @constructor
     */
    var DerivedModel = util.derive(UIModel);

    /**
     * 静默更新数据标识
     *
     * @const
     * @type {Object}
     */
    var OPT_SILENT = { silent: true };
    
    /**
     * 初始化，可以在此指定dataLoader
     */
    DerivedModel.prototype.initialize = function () {
        var me = this;
        var endday = me.get('endday');
        var startday = me.get('startday');
        var page = me.get('page');
        if (endday && startday && page) {
            var pageData = require('common/getPageData/pagePerformanceData').getDataByPage(page);
            var setObj = {
                // pname: pageData.performance_name,//属性集合
                pname: pageData.performance_name,//属性集合
                pnamecn: pageData.pnamecn,//属性对译中文
                position: pageData.position,//分位集合
                selectopition: pageData.select_opition,//template render数据
                pagename: pageData.pagename,//页面名
                expect: pageData.expect,//属性期望集合
                dbname: pageData.dbname//页面数据库名集合
            };
            me.fill(setObj);
            
            me.setDataLoader(new PerformanceDataLoader(pageData.dbname));//debugger
        }
        else {
            me.redirectHash();//重定向到默认参数值
        }
        
    };
    
    DerivedModel.prototype.prepare = function (resolve, reject) {
        resolve();
    };
    
    /**
    * 参数默认值的redirect
    */
    DerivedModel.prototype.redirectHash = function() {
        var endday = moment(new Date()).add('days', -1).format('YYYY-MM-DD');
        var startday = moment(new Date()).add('days', -8).format('YYYY-MM-DD');
        var page = 'planmanage';
        util.updateQuery({//通过locator直接redirect
            page: page,
            endday: endday,
            startday: startday
        });
    }
    
    return DerivedModel;
});
