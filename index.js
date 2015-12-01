/*
 * http://video.baidu.com/
 */

'use strict';
var https = require('./https.js');
    fis.util.write('./protocol-fix.log', '');
module.exports = function(content, file, conf){
    var type = '';
    var cont = content;
    // remove模式检查并移除插件，fix模式检测插件
    var mode = conf.off ? 'remove':'fix';
    // 域名对照表，在fis-conf中设定，需传递至fis插件、php勾子以及js勾子中
    var hostMap = {
        't1.baidu.com':'https://gss0.baidu.com/6ON1bjeh1BF3odCf',
        't2.baidu.com':'https://gss0.baidu.com/6OZ1bjeh1BF3odCf',
        't3.baidu.com':'https://gss0.baidu.com/6OV1bjeh1BF3odCf',
        'vs0.bdstatic.com': 'https://gss0.baidu.com/6qVWsjikBxIFlNKl8IuM_a',
        'vs1.bdstatic.com': 'https://gss0.baidu.com/6qVXsjikBxIFlNKl8IuM_a',
        'vs3.bdstatic.com': 'https://gss0.baidu.com/6qVZsjikBxIFlNKl8IuM_a',
        'vs4.bdstatic.com': 'https://gss0.baidu.com/6qVSsjikBxIFlNKl8IuM_a',
        'vs5.bdstatic.com': 'https://gss0.baidu.com/6qVTsjikBxIFlNKl8IuM_a',
        'vs6.bdstatic.com': 'https://gss0.baidu.com/6qVUsjikBxIFlNKl8IuM_a',
        'list.video.baidu.com': 'https://gss0.baidu.com/8LsZeHSy0QIJnhGko9WTAnF6hhy',
        'a.hiphotos.baidu.com': 'https://gss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy',
        'b.hiphotos.baidu.com': 'https://gss0.baidu.com/9vo3dSag_xI4khGko9WTAnF6hhy',
        'c.hiphotos.baidu.com': 'https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy',
        'd.hiphotos.baidu.com': 'https://gss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy',
        'e.hiphotos.baidu.com': 'https://gss0.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy',
        'f.hiphotos.baidu.com': 'https://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy',
        'g.hiphotos.baidu.com': 'https://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy',
        'hiphotos.baidu.com': 'https://gss0.baidu.com/7LsWdDW5_xN3otqbppnN2DJv',
        'nsclick.baidu.com': 'https://gss0.baidu.com/8qUJcD3n0sgCo2Kml5_Y_D3',
        'img.baidu.com': 'https://gss0.baidu.com/70cFsjip0QIZ8tyhnq',
        // 'su.bdimg.com': 'https://test.bdstatic.com',
        // 'p.tanx.com': 'https://test.bdstatic.com',
        // 's0.hao123img.com': 'https://test.bdstatic.com',
        // 's1.hao123img.com': 'https://test.bdstatic.com',
        // 'v.hao123.com': 'https://test.bdstatic.com',
        // 'life.hao123.com': 'https://test.bdstatic.com',
        // 'moe.hao123.com': 'https://test.bdstatic.com',
        // 'ufo.baidu.com': 'https://test.bdstatic.com',
        // 'passport.bdimg.com': 'https://test.bdstatic.com',
        // 'v.baidu.com': 'https://v.baidu.com'
    }
    cont = https.check(content, file, hostMap, mode);
    return cont;
};

