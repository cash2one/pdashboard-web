/**
 * @file 全局actionConf配置主入口
 * @author Leo Wang(wangkemiao@baidu.com)
 */

define(function (require) {
    return [
        require('entry/actionConf'),
        require('module/actionConf')
    ];
});