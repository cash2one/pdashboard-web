/**
 * @file echart条件选择和画图区域Component 
 *
 * @author Gu Shouchuang(gushouchuang@baidu.com)
 */

define(function (require) {

    var _ = require('underscore');
    var fc = require('fc-core');
    var moment = require('moment');
    var util = require('common/util');
    var BaseComponent = require('fc-view/component/BaseComponent');
    var echarts = require('echarts');
    
    var PerformanceDataLoader = require('../dataLoader/PerformanceDataLoader');

    /**
     * 静默更新数据标识
     *
     * @const
     * @type {Object}
     */
    var OPT_SILENT = { silent: true };
    
    var overrides = {};

    /**
    * initialize
    */
    overrides.initialize = function () {
        var me = this;
        var dbname = me.model.get('dbname');
        // me.setDataLoader(new PerformanceDataLoader(dbname));//debugger
    }   

    /**
    * prepare
    */
    overrides.prepare = function (model) {
        var dbName = model.get('dbname');
        var startday = model.get('startday');
        var endday = model.get('endday');
        var displayDateNum = (moment(endday) - moment(startday)) / (60 * 60 * 24 * 1000) + 1;
        for (var idb = 0; idb < dbName.length; idb++) {
            var cdbname = dbName[idb];
            var dateData = _.indexBy(model.get(cdbname), 'recordTimestamp');
            // console.log(dateData);
            var dateTime = _.keys(dateData).sort();
            var date = '';//局部变量
            var dateDisplay = [];//日期display数组
            var dateLen = dateTime.length;
            
            var compareFlag = true;//debugger 简单判定compare 有数据缺失就不让对比
            if (dateLen && dateLen !== displayDateNum * 2) {
                console.log('对比的数据量不够，不能支持对比');
                compareFlag = false;
                model.set('uncompare', true);
            }
            var startdayTime = +(new Date(startday + ' 00:00:00').getTime());
            var dataPositon = model.get('position');//分位值
            var positionLen = dataPositon.length;
            var perName = model.get('pname')[cdbname];//属性列表
            var weekData = {};//局部数据存储对象
            var pos = '';//position
            var pName = '';//局部属性变量
            for (var idate = 0; idate < dateLen; idate++) {
                date = +dateTime[idate];
                var perNameLen = perName.length;
                for (var iname = 0; iname < perNameLen; iname++) {
                    pName = perName[iname];
                    if (!weekData[pName]) {
                        weekData[pName] = {};
                    }
                    for (var ipos = 0; ipos < positionLen; ipos++) {
                        pos = dataPositon[ipos];
                        if (!weekData[pName][pos]) {
                            weekData[pName][pos] = {
                                cur: [],
                                prev: []
                            };
                        }
                        var fixedData = util.fixed2Data(dateData[date][pName][pos], 2);
                        if (date >= startdayTime) {
                            weekData[pName][pos].cur.push(fixedData);
                            var cDate = moment(date).format('YYYY-MM-DD');
                            if (dateDisplay.indexOf(cDate) === -1) {
                                dateDisplay.push(cDate); 
                            }
                        }
                        else {
                            weekData[pName][pos].prev.push(fixedData);
                        }
                    }
                }
            };
            
            /**
            * model.set储存数据 
            * cur -- 本周/ prev -- 上周
            * performance_xxx
            * average/95/80
            */
            // 将处理后的值 进行set存储
            for (var pname in weekData) {
                for (var position in weekData[pname]) {
                    model.set('cur' + cdbname + pname + position, weekData[pname][position].cur, OPT_SILENT);
                    // console.log('cur' + cdbname +  pname + position);
                    if (compareFlag) {
                        model.set('prev' + cdbname + pname + position, weekData[pname][position].prev, OPT_SILENT);
                    }
                }
            }
            model.set(cdbname + 'dateArr', dateDisplay, OPT_SILENT);
        }
    };
    
    /**
    * render template (return data)
    */
    overrides.getTemplatedData = function () {
        var selectOpition = this.model.get('selectopition');
        return {
            'page': this.model.get('pagename'),
            'select-opition-position': selectOpition['select-opition-position'],
            'select-opition-date': selectOpition['select-opition-date'],
            'select-opition-pname': selectOpition['select-opition-pname'],
            'echart-node': selectOpition['echart-node']
        };
    };
    
    overrides.uiProperties = {
        
    };
    
    /**
    * ui init event
    */
    overrides.uiEvents = {
        'select-position' : {//分位条件选择
            change: function (event) {
                this.opitionChange('position', event.target.getValue(), $(event.target.main));
            }
        },
        'select-date' : {//双周对比选择
            change: function (event) {
                var unCompare = this.model.get('uncompare');
                if (unCompare) {
                   //数据量太少
                   alert('抱歉，数据量不够进行对比。');
                   return;
                }
                this.opitionChange('datecmp', event.target.getValue(), $(event.target.main));
            }
        },
        'select-tagname' : {//展示属性选择
            change: function (event) {
                this.opitionChange('pname', event.target.rawValue, $(event.target.main));
            }
        }
    };
    
    /**
     * echarts render
     * @param key {String} 
     * @param value {String}
     * @param cnode {jquery node}
     */
    overrides.opitionChange = function (key, value, cnode) {
        this.model.set(key, value);
        var cNode = cnode.parents('section.chart-section').find('div.echartCon');
        this.renderLineChart(cNode);
    }
    
    /**
     * echarts render
     * @param data {jquery node}
     */
    overrides.renderLineChart = function(node) {
        var me = this;
        var model = me.model;
        
        var opition = {
            pname: model.get('pname'),
            pnameCn: model.get('pnamecn'),//中文
            position: model.get('position'),
            datecmp: model.get('datecmp'),
            node: node,
            data: {}
        };
        var filename = '../option/mainPerformace';
        if(opition.datecmp) {
            if (opition.pname.length > 1) {
                alert('暂不支持多属性双周对比');
                return; //多种属性和上周对比的情况 
            }
            filename = '../option/onePerformace';
        }
        $.each(opition.node, function () {
            var cNode = $(this);
            var page = '';
            var pname = '';
            var pnameStr = '';
            (function (node) {
                require([filename], function (optionObj) {
                    spentPerNode = echarts.init(node);
                    
                    var nodeData = $(node).data();
                    var dbName = nodeData.db;
                    var dbPerName = opition.pname[dbName];
                    opition.data = {
                        date:  me.model.get(dbName + 'dateArr')
                    };
                    opition.dbname = dbName;
                    opition.expect = me.model.get('expect')[dbName];
                    opition.text = nodeData.text || '';
                    for (var iname = 0; iname < dbPerName.length; iname++) {
                        pname = dbPerName[iname];
                        pnameStr = '';
                        opition.data[pname] ={};
                        opition.data[pname] = {
                            cur : me.model.get('cur' + dbName  + pname + opition.position),
                            prev : me.model.get('prev' + dbName + pname + opition.position)
                        }
                        if(!opition.data[pname].cur) {//debugger
                           //没有数据
                            $(node).html('<p class="center">'+ dbName +'表暂无数据</p>');
                            return;
                        };
                    }
                    optionObj.oSetOption(spentPerNode, opition);
                }); 
            })(cNode[0]);
        });
    } 
    
    /**
    * initBehavior
    */
    overrides.initBehavior = function () {
        var me = this;
        var model = me.model;
        var perName = model.get('pname');
        var defaults = {
            pname : perName,
            position : '95',
            datecmp : false
        }
        model.fill(defaults, {
            silent: true 
        });
        //init echarts
        me.renderLineChart($('.echartCon'));
        // console.log(me.getGroup('select-position'));
    };

    return fc.oo.derive(BaseComponent, overrides);
});
