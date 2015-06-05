/**
 * @file 主入口
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    require('esui');
    require('echarts/chart/line');
    require('echarts/chart/bar');
    require('echarts/chart/scatter');
    require('echarts/chart/k');
    require('echarts/chart/pie');
    require('echarts/chart/radar');
    require('echarts/chart/force');
    require('echarts/chart/chord');
    require('echarts/chart/gauge');
    require('echarts/chart/funnel');
    require('er/controller').registerAction(
        require('underscore').flatten(require('./actionConf'))
    );
    require('er').start();
});