/**
 * @file 一周内performance_xx参数展示 允许多选
 * @author Gu Shouchuang(gushouchuang@baidu.com)
 * @param 
 */

define(function (require) {

    var util = require('common/util');
    var _ = require('underscore');
    var moment = require('moment');
    
    var mkPerName = ['performance_materialList', 'performance_emanage_coreword_is_stable'];
    var mkPosition = ['95', 'average'];
    
    /**
     * echarts render
     *
     * @param enode [Echart node]
     * @param opition [Object] 条件属性
     * @return
     */
    function oSetOption (enode, opition) {
        var perName = opition.pnameCn;
        var dbName = opition.dbname;
        var position = opition.position;
        var expectValue = opition.expect;
        var spentData = opition.data || {};
        
        var displayDates = spentData.date;
        var series = [];
        var legend = [];
        var yAxis = [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value} ms'
                }
            }
        ];
        for (var pname in spentData) {
            if (pname !== 'date') {
                legend.push(perName[dbName][pname]);
                var data = {
                    name: perName[dbName][pname],
                    type: 'line',
                    symbol: 'emptyCircle',
                    data: spentData[pname]['cur']
                };
                if (mkPerName.indexOf(pname) > -1 && mkPosition.indexOf(position) > -1) {
                    var mkExpectValue = expectValue[pname][position];
                    data.markLine = {
                        data: [
                            [
                                {name: '期望值', value: mkExpectValue, xAxis: -999, yAxis: mkExpectValue}  ,
                                {name: '期望值', xAxis: 999, yAxis: mkExpectValue} 
                            ],
                            {type : 'average', name: '平均值'}
                        ]
                    }
                    yAxis[0].max = util.getYmaxObject(spentData, mkExpectValue);
                }
                series.push(data);
            }
        }
        var option = {
            title : {
                text: opition.text + position + '分位各参数数据',
                subtext: 'edpx-fclog by gushouchuang'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data: legend
            },
            color: [
                '#51A7F9',
                '#70BF41',
                '#FBE12B',
                '#EF951A',
                '#AC71CC'
            ],
            toolbox: {
                show : true,
                feature : {
                    // mark : {show: true},
                    // dataView : {show: true, readOnly: false},
                    // magicType : {show: true, type: ['line', 'bar']},
                    // restore : {show: true},
                    // saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : displayDates
                }
            ],
            yAxis : yAxis,
            series : series
        };
        enode.setOption(option);        
    }
    return {
        oSetOption: oSetOption
    };
});
