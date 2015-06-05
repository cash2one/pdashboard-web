/**
 * @file 近两周的performance_xx值对比 只能单选并显示上周对比
 * @author Gu Shouchuang(gushouchuang@baidu.com)
 * @param 
 */

define(function (require) {

    var util = require('common/util');
    var moment = require('moment');
    
    var mkPerName = ['performance_materialList', 'performance_emanage_coreword_is_stable'];
    var mkPosition = ['95', 'average'];
    
    /**
    * render echarts
    *
    * @param enode [Echart node]
    * @param opition [Object] 条件属性
    * @return
    */
    function oSetOption (enode, opition) {
        var position = opition.position;
        var perName = opition.pname[0];
        
        var expectValue = opition.expect;
        
        var displayDates = opition.data.date;//近一周的日期
        var curWeekData = opition.data[perName].cur;//近一周的数据
        var prevWeekData = opition.data[perName].prev;//前一周的数据
        
        var series = [];
        var data = {
            name : '本阶段内' + perName + '参数值',
            type : 'line',
            symbol : 'emptyCircle',
            symbolSize : 5,
            data : curWeekData,
            itemStyle : {
                normal : {
                    lineStyle : {
                        width : 3
                    }
                }
            }                       
        };
        var yAxis = [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value} ms'
                }
            }
        ];
        //markline
        if (mkPerName.indexOf(perName) > -1 && mkPosition.indexOf(position) > -1) {
            var mkExpectValue = expectValue[perName][position];
            data.markLine = {
                data : [
                    [
                        {name: '期望值', value: mkExpectValue, xAxis: -999, yAxis: mkExpectValue}  ,
                        {name: '期望值', xAxis: 999, yAxis: mkExpectValue} 
                    ],
                    {type : 'average', name: '平均值'}
                ]
            };
            
            var cMax = util.getYmaxArray(curWeekData, mkExpectValue);
            var pMax = util.getYmaxArray(curWeekData, mkExpectValue);
            yAxis[0].max = Math.max(cMax, pMax);
        }
        series.push(data);//本周数据
        series.push({//上周数据
            name : '环比上阶段' + perName + '参数值',
            type : 'line',
            symbol : 'emptyTriangle',
            symbolSize : 5,
            data :  prevWeekData,
            itemStyle : {
                normal : {
                    lineStyle : {
                        width : 3
                    }
                }
            }   
        });
        
        var option = {
            title : {
                text: position + '分位' + perName + '数据对比',
                subtext: 'edpx-fclog by gushouchuang'
            },
            tooltip : {
                trigger : 'axis'
            },
            legend: {
                data:['本阶段内' + perName + '参数值', '环比上阶段' + perName + '参数值']
            },
            color: [
                '#FF2D21',
                '#C7C7C7'
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