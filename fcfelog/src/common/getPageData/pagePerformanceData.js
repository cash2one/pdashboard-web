/**
 * @file 通过pagename返回该页面的参数集合
 * 
 * @author Gu Shouchuang(gushouchuang@baidu.com)
 */
var _ = require('underscore');
define(function (require) {
    /**
    * param planmanage model里page参数值
    * param pagename 页面名称
    * param dbname 该页面需要连接的数据库
    * param performance_name 每个数据库展示的参数属性名
    * param pnamecn 属性展示的中文对译
    * param position 分位值
    * param expect echarts中的markline 属性期望值
    * param select-opition template中render需要的数据
    */
    
    //固定公有属性 common
    var CONST_PARAM = {
        position: ['average', '80', '95', '50'],//数据分位值
        'select-opition-position': [{//模板渲染需要的数据 checkbox
            id: 'select-position-average',
            value: 'average',
            text: '平均值'
        }, {
            id: 'select-position-95',
            value: '95',
            text: '95分位值',
            check: 'checked'
        }, {
            id: 'select-position-80',
            value: '80',
            text: '80分位值'
        }, {
            id: 'select-position-50',
            value: '50',
            text: '50分位值'
        }],
        'select-opition-date': [{
            id: 'select-date-select',
            value: 'selected',
            text: '显示上周对比'
        }]
    };
    
    //页面属性 动态添加
    var PAGE_PARAM = {
        'planmanage' : {
            pagename: '推广管理页',//页面名
            dbname: {//key-dbname  value-数据库文案
                performance_plan_basic: '计划页',
                performance_keyword_basic: '关键词页',
                performance_keywordii_basic: '关键词观察页面'
            },
            pername: {//performance属性名
                performance_static: {//text-文案 id-checkbox控件的id
                    text: '静态资源',
                    id: 'select-tagname-static'
                },
                performance_materialList: {
                    text: '物料列表',
                    id: 'select-tagname-materialist',
                    expect: {
                        'average' : 3500,
                        '95' : 6000
                    }
                },
                performance_accountTree: {
                    text: '账户树',
                    id: 'select-tagname-acc'
                },
                performance_ao_manual: {
                    text: '优化建议',
                    id: 'select-tagname-ao'
                }
            }
        },
        'emanage' : {
            pagename: '便捷管理页',
            dbname: {
                performance_emanage_basic: '便捷管理页面'
            },
            pername: {
                performance_static: {
                    text: '静态资源',
                    id: 'select-tagname-static'
                },
                performance_emanage_sidebar_ActDataView_rendered: {
                    text: '账户数据',
                    id: 'select-tagname-sidebar-ActDataView-rendered'
                },
                performance_emanage_aopkg_enter: {
                    text: '优化包',
                    id: 'select-tagname-aopkg-enter'
                },
                performance_emanage_coreword_is_stable: {
                    text: '看排名',
                    id: 'select-tagname-coreword-is-stable',
                    expect: {
                        'average' : 3500,
                        '95' : 6000
                    }
                }
            }
        },
        'corefunction' : {
            pagename: '关键词页面核心功能',
            dbname: {
                performance_keyword_coreFunction: '老版本',
                performance_keywordii_coreFunction: '新版本'
            },
            pername: {
                performance_mod_bid: {
                    text: '批量关键词出价',
                    id: 'select-tagname-bid'
                },
                performance_mod_wurl: {
                    text: '批量关键词url',
                    id: 'select-tagname-wurl'
                },
                performance_mod_mwurl: {
                    text: '批量无线关键词url',
                    id: 'select-tagname-mwurl'
                },
                performance_mod_wmatch: {
                    text: '批量关键词匹配模式',
                    id: 'select-tagname-wmatch'
                },
                performance_mod_bid_inline: {
                    text: '关键词出价',
                    id: 'select-tagname-bid-inline'
                },
                performance_mod_wurl_inline: {
                    text: '关键词url',
                    id: 'select-tagname-wurl-inline'
                },
                performance_mod_mwurl_inline: {
                    text: '无线关键词url',
                    id: 'select-tagname-mwurl-inline'
                },
                performance_mod_wmatch_inline: {
                    text: '关键词匹配模式',
                    id: 'select-tagname-wmatch-inline'
                }
            }
        }
    };
     
    //处理页面render需要的数据
    var dynamicPageData = {};
    var sel_pname_flag = true;
    for (var page in PAGE_PARAM) {
        if (dynamicPageData[page] == null) {
            dynamicPageData[page] = {};
        }
        var cPageData = PAGE_PARAM[page];
        dynamicPageData[page]['select_opition'] = {
            'select-opition-pname': [],
            'echart-node': []
        };
        dynamicPageData[page]['select_opition']['select-opition-pname'] = [];
        //add pagename
        dynamicPageData[page].pagename = cPageData.pagename;
        //add dbname
        dynamicPageData[page].dbname = _.keys(cPageData.dbname);
        
        var pername = _.keys(cPageData.pername);
        var dbArr = dynamicPageData[page].dbname;
        var dbLen = dbArr.length;
        dynamicPageData[page].pnamecn = {};
        dynamicPageData[page].expect = {};
        for (var idb = 0; idb < dbLen; idb++) {
            var dbname = dbArr[idb];
            if (dynamicPageData[page].performance_name == null) {
                dynamicPageData[page].performance_name  = {};
            }
            //add performance_name
            dynamicPageData[page].performance_name[dbname] = pername;
            //add echart-node
            dynamicPageData[page]['select_opition']['echart-node'].push({
                db: dbname,
                text: cPageData.dbname[dbname]
            });
            //add pnamecn
            dynamicPageData[page].pnamecn[dbname] = {};
            dynamicPageData[page].expect[dbname] = {};
            for (var iname = 0; iname < pername.length; iname++) {
                var pname = pername[iname];
                dynamicPageData[page].pnamecn[dbname][pname] = cPageData.pername[pname].text;
                //add select_opition/select-opition-pname
                if (sel_pname_flag) {
                    dynamicPageData[page]['select_opition']['select-opition-pname'].push({
                        id: cPageData.pername[pname].id,
                        check: 'checked',
                        text: cPageData.pername[pname].text,
                        value: pname
                    });
                }
                
                if (cPageData.pername[pname].expect) {
                    dynamicPageData[page].expect[dbname][pname] = cPageData.pername[pname].expect;
                }
            }
            
            if (idb === 0) {
                sel_pname_flag = false;
            }
        }
        //add position
        dynamicPageData[page].position = CONST_PARAM.position;
        //add position select_opition
        dynamicPageData[page]['select_opition']['select-opition-position'] = CONST_PARAM['select-opition-position'];
        dynamicPageData[page]['select_opition']['select-opition-date'] = CONST_PARAM['select-opition-date'];
    };
    
    
    var overrides = {};
    overrides.getDataByPage = function (page) {
        return dynamicPageData[page];
    };

    return overrides;
});
