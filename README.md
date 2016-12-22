# fis-parse-protocolfix
**插件功能**  
> fis插件，用于解析模版中所有的 'src', 'action', 'href', 'background','background-image'相关的链接，将它们的http协议替换成https。

**安装命令**
> npm install -g http://gitlab.baidu.com/videofe/fis-parser-protocolfix/repository/archive.tar.gz?ref=master

**使用方法**
>fis-conf.js中配置在parser阶段  
>编译时会产出一份protocol-fix.log的日志，里面记录了模块中所有待处理的url链接，根据需要对链接做相应的处理，js语境中用 "__protocol" 方法把url包起来;smarty变量尾部添加 "|protocol" 修饰器

**配置示例**
>     {
        // 需替换的url对照
        hostMap : {
            'nsclick.baidu.com': 'https://gsp0.baidu.com/8qUJcD3n0sgCo2Kml5_Y_D3',
            'pc.videoclick.baidu.com': 'https://gsp0.baidu.com/8qUJcD3n0sgCo2Kml5_Y_D3',
            'static.tieba.baidu.com': '//',
            'v.baidu.com\\/videoapi': '//v.baidu.com/videoapi',
            'v.baidu.com\\/commonapi': '//v.baidu.com/commonapi',
            'v.baidu.com\\/staticapi\\/': '//v.baidu.com/staticapi/',
            'v.baidu.com\\/\\?pagelets': '/?pagelets',
            'v.baidu.com\\/d\\?': '//v.baidu.com/d?'
        },
        // 模式切换，true为移除模式，会清理掉代码中添加的插件关键字protocol_none、__protocol、|protocol。
        // false 表示启用模式
        off : true
    }