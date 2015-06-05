/**
 * @file dashboard中页面初始化dataLoader
 *
 * @author Gu Shouchuang(gushouchuang@baidu.com)
 */

define(function (require) {

    var moment = require('moment');
    var fc = require('fc-core');
    var DataLoader = require('fc-view/mvc/DataLoader');
    var service = require('../service');
    
    var overrides = {};
    overrides.constructor = function (dbname) {
        this.$super(arguments);
        var dbName = dbname;
        var option = {};
        for (var i = 0; i < dbName.length; i++) {
            (function (i) {
                option[dbName[i]] = function (model) {
                var endday = model.get('endday');
                var startday = model.get('startday');
                var endTimestramp = new Date(endday + ' 23:59:59').getTime();
                //计算需要对比的初始时间戳
                var startTimestramp = new Date(moment(moment(endday) 
                    - ((moment(endday) - moment(startday)) * 2 
                    + (24 * 60 * 60 * 1000))).format('YYYY-MM-DD')
                    + ' 00:00:00').getTime();
            
                var dbOption = { 
                    recordTimestamp: {
                        $gte: startTimestramp,
                        $lte: endTimestramp
                    }
                };
                var params = {
                    dbCollectionName: dbName[i],
                    dbQuery: JSON.stringify(dbOption)
                };
                return service.getPerformanceData(params);
            }
            })(i);
        };
        this.put(option);
    };

    var PerformanceDataLoader = fc.oo.derive(DataLoader, overrides);

    return PerformanceDataLoader;
});
