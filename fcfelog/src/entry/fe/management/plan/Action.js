/**
 * @file performance展示页面 - Action定义
 * @author Gu Shouchuang (gushouchuang@baidu.com)
 */

define(function (require) {
    var Action = require('fc-view/mvc/EntryAction');
    var echarts = require('echarts');
    var moment = require('moment');
    var util = require('common/util');
    require('fc-component-ria/component!./component/performance');
    // var lineEchart = require('./echartClass/main');
    /**
     * Action定义
     * @constructor
     * @extends {Action}
     */
    var DerivedAction = util.derive(Action);

    /**
     * 指定Model
     * @type {Model}
     */
    DerivedAction.prototype.modelType = require('./Model');
    
    /**
     * 指定 View
     * @type {View}
     */
    DerivedAction.prototype.viewType = require('./View');

    /**
     * 初始化行为交互
     */
    DerivedAction.prototype.initBehavior = function () {
        var me = this;
        var view = me.view;
        view.initEvent();//绑定nav的tab切换click
    };

    return DerivedAction;
});
