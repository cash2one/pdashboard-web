/**
 * @file performance展示页面 - View定义
 * @author Gu Shouchuang (gushouchuang@baidu.com)
 */

define(function (require) {
    var UIView = require('fc-view/mvc/EntryView');
    var util = require('common/util');
    var moment = require('moment');
    var etpl = require('etpl');
    
    // require('esui/Calendar');
    require('esui/CheckBox');
    require('esui/BoxGroup');
    require('esui/RangeCalendar');
 
    require('etpl/tpl!./tpl.tpl');
    require('css!./style.less');

    /**
     * performance展示页面 - View定义
     *
     * @class ?
     * @extends {er.View}
     * @constructor
     */
    var DerivedView = util.derive(UIView);

    /**
    * @property {string} [template] 所使用的模板
    */
    DerivedView.prototype.template = 'entry-index';
    
    /**
     * esui控件事件声明
     *
     * @type {Object}
     */
    DerivedView.prototype.uiEvents = {
        /**
         * 日期控件事件声明
         */
        'range-date-select': {
            change: function (event) {
                util.updateQuery({
                   startday: moment(event.target.rawValue.begin).format('YYYY-MM-DD'),
                   endday: moment(event.target.rawValue.end).format('YYYY-MM-DD')
                });
            }
        }
    }
    /**
     * 设置该view内的各ui组件属性。
     */

    DerivedView.prototype.uiProperties = {
        'range-date-select': {
            rawValue : {
                begin : '@startday',
                end: '@endday'
            }
        }
    };
    /**
     * init事件处理
     */
    DerivedView.prototype.initEvent = function () {
        var me = this;  
        var model = me.model;
        var page = model.get('page');   
        
        var rangeDate = me.get('range-date-select');
        var startday = model.get('startday');
        var endday = model.get('endday');
        var yesDate = new Date(moment(new Date()).add('days', -1));

        rangeDate.setProperties({
            value: startday + ' 00:00:00,'+ endday + '23:59:59',
            range: {
                end: yesDate
            }
        });

        $('#page-nav').find('a[data-page=' + page + ']').addClass('nav-current');
            
        $(me.getContainerElement()).on('click', '#page-nav a', function (event) {
            if ($(this).hasClass('nav-current')) {
                return;
            }
            var data = $(this).data();
            var page = data.page;
            util.updateQuery({
                page: page
            });
        }); 
    };
    
    return DerivedView;
});
