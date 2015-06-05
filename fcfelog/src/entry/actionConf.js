/**
 * @file 页面入口actionConf配置
 * @author Gu Shouchuang(gushouchuang@baidu.com)
 */

define(function (require) {
    return [
        {
            path: '/',
            movedTo: '/fe/management/plan'
        },
        {
            path: '/index',
            type: 'entry/index/Action'
        },
        require('./fe/actionConf')
    ];
});
