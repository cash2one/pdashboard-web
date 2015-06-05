/**
 * @file
 * @author Leo Wang(wangkemiao@baidu.com)
 * @author Gu Shouchuang(gushouchuang@baidu.com) changed 
 */

define(function (require) {
    var locator = require('er/locator');
    var URL = require('er/URL');
    var moment = require('moment');
    var Deferred = require('er/Deferred');
    var _ = require('underscore');
    // var ajax = require('fc-ajax');
    var util = {};
    
    util.getAllData = function (type, startday, finishday) {
        var startday = moment(startday || '2014-10-23');
        var finishday = moment(finishday || '2014-11-02');

        // 计算
        var startdayStr = startday.format('YYYYMMDD');
        var finishdayStr = finishday.format('YYYYMMDD');
        var toRequire = [];
        var keys = [];
        while (startdayStr != finishdayStr) {
            toRequire.push('mockData/' + startdayStr + '/' + type);
            keys.push(startdayStr);
            startday = startday.add('days', 1);
            startdayStr = startday.format('YYYYMMDD');
        }

        // 加载
        return Deferred.require(toRequire).done(function () {
            var result = Array.prototype.slice.call(arguments, 0);
            var data = {};
            for (var i = 0, l = toRequire.length; i < l; i++) {
                data[keys[i]] = result[i];
            }
            return data;
        });

    };

    util.getAllLevelSum = function () {
        return util.getAllData('switchLevel', '2014-12-26', '2014-12-30').done(
            function (levelSum) {
                return levelSum;
            }
        );
    };

    util.getAllUASpentSum = function () {
        return util.getAllData('uaSpent', '2014-10-23', '2014-12-11').done(
            function (spentData) {
                dates = Object.keys(spentData);
                var initArr = dates.map(function () {return 0;});
                // 平均时间
                var spent = {
                    dates: [],
                    pv: {
                        all: [].concat(initArr),
                        byUA: {},
                        byUASum: {}
                    },
                    average: {
                        all: [].concat(initArr),
                        byUASum: {}
                    },
                    byPercent: {
                        all: {
                            80: [].concat(initArr),
                            95: [].concat(initArr)
                        },
                        byUASum: {
                            80: {},
                            95: {}
                        }
                    }
                };
                dates.forEach(function (date, idx) {
                    spent.dates.push(date);
                    spent.average.all[idx] = spentData[date].average.all;
                    spent.byPercent.all['80'][idx] = spentData[date].spentByPercent.all['80'];
                    spent.byPercent.all['95'][idx] = spentData[date].spentByPercent.all['95'];
                    spent.pv.all[idx] = spentData[date].pv.all;
                    Object.keys(spentData[date].pv.byUA).forEach(function (key) {
                        spent.pv.byUA[key] = spent.pv.byUA[key] || [].concat(initArr);
                        spent.pv.byUA[key][idx] = spentData[date].pv.byUA[key]
                    });
                    Object.keys(spentData[date].pv.byUASum).forEach(function (key) {
                        spent.pv.byUASum[key] = spent.pv.byUASum[key] || [].concat(initArr);
                        spent.pv.byUASum[key][idx] = spentData[date].pv.byUASum[key]
                    });
                    for (var key in spentData[date].average.byUASum) {
                        spent.average.byUASum[key] = spent.average.byUASum[key] || [].concat(initArr);
                        spent.average.byUASum[key][idx] = spentData[date].average.byUASum[key];
                    }
                    for (var key in spentData[date].spentByPercent.byUASum) {
                        spent.byPercent.byUASum['80'][key] = spent.byPercent.byUASum['80'][key] || [].concat(initArr);
                        spent.byPercent.byUASum['80'][key][idx] = spentData[date].spentByPercent.byUASum[key]['80'];

                        spent.byPercent.byUASum['95'][key] = spent.byPercent.byUASum['95'][key] || [].concat(initArr);
                        spent.byPercent.byUASum['95'][key][idx] = spentData[date].spentByPercent.byUASum[key]['95'];
                    }

                });

                return spent;
            }
        );
    }

    util.getAllSpentData = function () {
        // 加载
        return util.getAllData('spent', '2014-10-23').done(function (spentData) {
            dates = Object.keys(spentData);
            var initArr = dates.map(function () {return 0;});
            // 平均时间
            var spent = {
                dates: [],
                average: {
                    all: [].concat(initArr),
                    byUASum: {}
                },
                byPercent: {
                    all: {
                        80: [].concat(initArr),
                        95: [].concat(initArr)
                    },
                    byUASum: {
                        80: {},
                        95: {}
                    }
                },
                spread: {}
            };
            dates.forEach(function (date, idx) {
                spent.dates.push(date);
                spent.average.all[idx] = spentData[date].average.all;
                spent.byPercent.all['80'][idx] = spentData[date].spentByPercent.all['80'];
                spent.byPercent.all['95'][idx] = spentData[date].spentByPercent.all['95'];
                for (var key in spentData[date].average.byUASum) {
                    spent.average.byUASum[key] = spent.average.byUASum[key] || [].concat(initArr);
                    spent.average.byUASum[key][idx] = spentData[date].average.byUASum[key];
                }
                for (var key in spentData[date].spentByPercent.byUASum) {
                    spent.byPercent.byUASum['80'][key] = spent.byPercent.byUASum['80'][key] || [].concat(initArr);
                    spent.byPercent.byUASum['80'][key][idx] = spentData[date].spentByPercent.byUASum[key]['80'];

                    spent.byPercent.byUASum['95'][key] = spent.byPercent.byUASum['95'][key] || [].concat(initArr);
                    spent.byPercent.byUASum['95'][key][idx] = spentData[date].spentByPercent.byUASum[key]['95'];
                }

                spent.spread[date] = spentData[date].spread;
            });

            return spent;
        });
    };

    util.getAllBrowserData = function () {
        // 加载
        return util.getAllData('spent', '2014-10-01').done(function (spentData) {
            // 平均时间
            var browser = {
                dates: [],
                pv: {
                    byUASum: {}
                }
            };

            for (var date in spentData) {
                browser.dates.push(date);
                for (var key in spentData[date].pv.byUASum) {
                    browser.pv.byUASum[key] = browser.pv.byUASum[key] || [];
                    browser.pv.byUASum[key].push(spentData[date].pv.byUASum[key]);
                }
            }
            return browser;
        });
    };

    util.getAllCachedData = function () {
        return util.getAllData('cached', '2014-10-17').done(function (cachedData) {
            var toReturn = {
                dates: [],
                percent: {
                    all: [],
                    byUAType: {
                        "Chrome": [],
                        "Firefox": [],
                        "Safari": [],
                        "IE": [],
                        "other": [],
                        "Opera": []
                    }
                },
                count: {
                    all: [],
                    byUAType: {
                        "Chrome": [],
                        "Firefox": [],
                        "Safari": [],
                        "IE": [],
                        "other": [],
                        "Opera": []
                    }
                }
            };
            for (var k in cachedData) {
                toReturn.dates.push(k);
                var value = +(cachedData[k].all.cached / cachedData[k].all.total * 100).toFixed(2);
                if (isNaN(value)) {
                    value = -1;
                }
                toReturn.percent.all.push({
                    value: value,
                    total: cachedData[k].all.total
                });
                toReturn.count.all.push(cachedData[k].all.total);
                for (var br in cachedData[k].byUAType) {
                    value = +(cachedData[k].byUAType[br].cached / cachedData[k].byUAType[br].total * 100).toFixed(2);
                    if (isNaN(value)) {
                        value = -1;
                    }
                    toReturn.percent.byUAType[br].push({
                        value: value,
                        total: cachedData[k].byUAType[br].total
                    });
                    toReturn.count.byUAType[br].push(cachedData[k].byUAType[br].total);
                }
            }
            return toReturn;
        });
    }

    util.getAllExtIpCacheData = function () {
        // 加载
        return Deferred.require(['mockData/alwaysExsitedCached']).done(function (cachedData) {
            // 平均时间
            var result = {
                idList: cachedData.idList,
                dates: [],
                data: {}
            };

            for (var i = 0, id; id = cachedData.idList[i++];) {
                var item = cachedData.dataList[id];
                result.data[id] = [];
                for (var date in item) {

                    if (!_.contains(result.dates, date)) {
                        result.dates.push(date);
                    }

                    var eachValue = item[date];
                    var toPush = {
                        cached: 0,
                        total: eachValue.length,
                        ipList: []
                    };

                    for (var j = 0; j < eachValue.length; j++) {
                        if (eachValue[j].isCached) {
                            toPush.cached++;
                        }
                        if (!_.contains(toPush.ipList, eachValue[j].ip)) {
                            toPush.ipList.push(eachValue[j].ip);
                        }
                    }
                    toPush.value = (toPush.cached / toPush.total * 100).toFixed(2);
                    result.data[id].push(toPush);
                }
            }
            return result;
        });
    };

    util.getBizSpentData = function () {
        // 再去获取对应的BCD的值
        return util.getAllData('bizSpent', '2014-10-10').done(function (bizSpentData) {
            var bizSpent = {  // only average
                dates: [],
                'performance_materialList': {
                    average: {
                        spent: [],
                        staticSpent: []
                    },
                    80: {
                        spent: [],
                        staticSpent: []
                    },
                    95: {
                        spent: [],
                        staticSpent: []
                    }
                },
                'performance_accountTree': {
                    average: {
                        spent: [],
                        staticSpent: []
                    },
                    80: {
                        spent: [],
                        staticSpent: []
                    },
                    95: {
                        spent: [],
                        staticSpent: []
                    }
                },
                'performance_ao_manual': {
                    average: {
                        spent: [],
                        staticSpent: []
                    },
                    80: {
                        spent: [],
                        staticSpent: []
                    },
                    95: {
                        spent: [],
                        staticSpent: []
                    }
                }
            };
            for (var date in bizSpentData) {
                bizSpent.dates.push(date);
                var item = bizSpentData[date];
                for (var target in item) {
                    if (target == 'realData') {
                        continue;
                    }
                    for (var k in item[target]) {
                        bizSpent[target][k].spent.push(item[target][k].all);
                        bizSpent[target][k].staticSpent.push(item[target][k].staticSpent);
                    }
                }
            }

            return bizSpent;
        });
    };
   
    util.inherits = require('er/util').inherits;
    /**
     * 由目标类派生新的类
     * 不提供自定义扩展了
     * 因为潜在覆盖同名方法的行为，可能会导致ER生命周期的管理出现问题
     *
     * @param {Class}
     */
    util.derive = function(target) {
        if ('string' === typeof target) {
            target = require(target);
        }

        function newDerive() {
            target.apply(this, arguments);
        }
        util.inherits(newDerive, target);

        return newDerive;
    };
    
    /**
    * update url的query, 将新queryredirect到地址栏上。
    * 如果参数中有null|undefined|''，就表明该参数将从地址栏上删除。
    * 
    * @param {Object} param
    * @param {boolean=} opt_options
    *     {
    *         silent: false // 若为true，则采用静默模式。
    *     }
    *     Others please see meta.RedirectOption
    */
    util.updateQuery = function (param, opt_options) {
        var url = URL.parse(location.hash);
        var query = url.getQuery();
        for (var i in param) {
            var value = param[i];
            if (value || value === 0) { // append value
                query[i] = value;
            } else {
                if (query.hasOwnProperty(i)) {
                    delete query[i];
                }
            }
        }
        locator.redirect(
            url.getPath() + '~' + URL.serialize(query),
            opt_options
        );
    };
    
    /**
    * data 要处理的数据
    * number 最多number位
    */
    util.fixed2Data = function (data, number) {
        var number = number || 0;
        var fixdata = (data + '').split('.');
        if (fixdata.length < 2 || fixdata[1].length <= number) {
            return +data;
        }
        return +(fixdata[0] + '.' + fixdata[1].substring(0, number));
    }
    
    /**
    * param data {Array}
    * 处理echarts的y轴和markline的bug
    * data 需要循环的data 找到max数据
    * expect 现有的对比最大值
    */
    util.getYmaxArray = function (data, expect) {
        var max = 0;
        if (data instanceof Array) {//one
            max = Math.max.apply({}, data);
        }
        if (max < expect) {
            max = expect;
        }
        return (Math.round(max) + 500);
    }
    
    /**
    * param data {Object}
    * 处理echarts的y轴和markline的bug
    * data 需要循环的data 找到max数据
    * expect 现有的对比最大值
    */
    util.getYmaxObject = function (data, expect) {
        var max = 0;
        for (var name in data) {
            if (name !== 'date') {
                for (var date in data[name]) {
                    var cData = data[name][date];
                    if (cData) {
                        for (var i = cData.length; i--;) {
                            if (max < cData[i]) {
                                max = cData[i];
                            }
                        }
                    }
                }
            }
        }
        if (max < expect) {
            max = expect;
        }
        return (Math.round(max) + 500);
    }
    return util;
});
