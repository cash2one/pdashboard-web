exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var ms = require('mockservice');

ms.config({
    name: 'fcfelog',
    dir: __dirname + '/debug'
});
exports.getLocations = function () {
    return [
        { 
            location: /\/$/, 
            handler: home( 'index.html' )
        },
        { 
            location: /^\/redirect-local/, 
            handler: redirect('redirect-target', false) 
        },
        { 
            location: /^\/redirect-remote/, 
            handler: redirect('http://www.baidu.com', false) 
        },
        { 
            location: /^\/redirect-target/, 
            handler: content('redirectd!') 
        },
        {
            location: /\/request\.ajax/,
            // handler: ms.request()//本地mock
            handler: proxy('cp01-rdqa-dev369.cp01.baidu.com', '8848')//bingfengh
            // handler: proxy('cp01-rdqa04-dev140.cp01.baidu.com', '8849')//shouchuang
        },
        { 
            location: '/empty', 
            handler: empty() 
        },
        { 
            location: /\.css($|\?)/, 
            handler: [
                autocss()
            ]
        },
        { 
            location: /\.less($|\?)/, 
            handler: [
                file(),
                less()
            ]
        },
        { 
            location: /\.styl($|\?)/, 
            handler: [
                file(),
                stylus()
            ]
        },
        { 
            location: /^.*$/, 
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
