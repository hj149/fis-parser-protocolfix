/*
 * http://video.baidu.com/
 */

'use strict';
function https () {
    this.caseNumber = 0;
    this.keyword = ['src', 'action', 'href', 'background','background-image'];
}

https.prototype.parse = function (content, hostmap, mode) {
    var self = this;
    self.rawContent = content.toString();
    self.error_result = [];
    self.fileContent = '';
    self.hostmap = hostmap;
    self.mode = mode;
    self.inAtag = false; //是否在a标签内部
    var res;
    while (self.rawContent.length) {
        var matchKey = false;
        for (var i = 0; i < self.keyword.length; i++) {
            var reg = new RegExp('\\W(' + self.keyword[i] + ')\\W', 'gm');
            if (reg.exec(self.rawContent) != null) {
                if(!matchKey || (reg.lastIndex - 1) < matchKey[0]) {
                    matchKey = [reg.lastIndex - 1, self.keyword[i]];
                }
            }

        }
        if (matchKey) {
            self.fixKeyUrl(matchKey[0], matchKey[1]);
        } else {
            self.fileContent += self.rawContent;
            self.rawContent = '';
        }
    }
    var headPos = self.fileContent.indexOf('{%head%}');
    if (headPos != -1) {
        var before = self.fileContent.substr(0, headPos + 8);
        var after = self.fileContent.substr(headPos + 8);
        self.fileContent = before
            + ('\n{%$protocolHostMap = json_decode(\''
            + JSON.stringify(self.hostmap).replace(/\\\\/g, '') +'\')%}\n'
            + '<script type="text/javascript">'
            + 'window["__protocol"] = function (url) {'
            + '       var res = url;'
            + '       var hostmap = ' + JSON.stringify(self.hostmap) + ';'
            + '       for (var hostReg in hostmap) {'
            + '          var reg = new RegExp("^((http|https)\:)?(\/\/)?" + hostReg);'
            + '           res = url.replace(reg, hostmap[hostReg]);'
            + '           if (res != url) {'
            + '               return res;'
            + '           }'
            + '       }'
            + '       return res;'
            + '   }'
            + '</script>\n')
            + after;
    }
    // console.log('总计有:' + self.caseNumber);
    if (self.error_result.length) {
        //fis.log.error
        var log = '未处理url协议\n修改方案：js语境中用 "__protocol" 方法把url包起来;smarty变量尾部添加 "|protocol" 修饰器\n'
            + '所在文件：' + self.fileInfo.realpath + '\n'
            + self.error_result.join('\n')
            + '\n--------------------------------------------------------------------------------------------------------------------------------------\n\n';
        fis.util.write('./protocol-fix.log', log, null, true);

    }
    // console.log(self.fileContent);
    return self.fileContent;
}
https.prototype.setFileInfo = function (file) {
    this.fileInfo = file
}
https.prototype.fixUrl = function (url) {
    var res = url;
    // 无需处理的
    if (url == '' || url.indexOf('?__inline') != -1 || url.match(/^('|")?(\.|\.\.|\/|#|#\w|javascript)/g)) {
        return url;
    }
    if (url.indexOf('|protocol_none') != -1) {
        res = url.replace(/\|protocol_none/gm, '');
        return res;
    }
    if (url.match(/^(?!http|https|\/\/|\.).+\.(jpg|png|gif|jpeg)$/g)) {
        return url;
    }
    // 第一步，如果能够匹配到就直接替换
    res = this.fixProtocol(url);
    if (res == url) {
        // 处理smarty和js插件
        var reg = new RegExp('(__protocol\\(|\\$(\\S)+\\|protocol)', 'g');
        if (reg.test(res)) {
            res = res.replace(/\|protocol/gm, '|protocol:$protocolHostMap');
            return res;
        } else {
            return false;
        }
    }
    return res;
}

https.prototype.fixProtocol = function (url) {
    var res = url;
    for (var hostReg in this.hostmap) {
        var reg = new RegExp('((http|https)\:)?(\/\/)?' + hostReg);
        res = url.replace(reg, this.hostmap[hostReg]);
        if (res != url) {
            return res;
        }
    }
    return res;
}

https.prototype.isInAtag = function () {
    // 查找a标签
    var self = this;
    var mark = 0;
    var len = 30;
    var pos = self.fileContent.lastIndexOf('<a ');
    if (pos == -1) {
        return false;
    }
    var content = self.fileContent.substr(pos + 3);
    if (content.lastIndexOf('</a>') == -1) {
        return true;
    } else {
        return false;
    }
}

https.prototype.fixKeyUrl = function (pos, key) {
    var self = this;
    self.fileContent += self.rawContent.substr(0, pos);
    self.rawContent = self.rawContent.substr(pos);
    var url;
    var mark = 0;
    var isBgImage = false;
    var quotes = 0;
    if (key == 'href' && self.isInAtag()) {
        return;
    }
    // 查找链接的开头位置
    while (true) {
        if (self.rawContent == '' || self.rawContent[0] == '=' && (self.rawContent[1] == '>' || self.rawContent[1] == '=')) {
            return;
        }


        if (key == 'background' && self.rawContent[mark] != '-' || key == 'background-image') {
            if (self.rawContent.substr(mark, mark + 4) == 'url(') {
                isBgImage = true;
                self.fileContent += self.rawContent.substr(0, mark + 4);
                self.rawContent = self.rawContent.substr(mark + 4);
                break;
            } else {
                if (self.rawContent[0] == ';') {
                    return;
                }
                self.fileContent += self.rawContent[0];
                self.rawContent = self.rawContent.substr(1);
                continue;
            }
        }
        if (self.rawContent[0] == '=' && self.rawContent[1] == '\\') {
            self.fileContent += self.rawContent.substr(0,3);
            self.rawContent = self.rawContent.substr(3);
            break;
        }
        if (self.rawContent[0] == '=' && self.rawContent[1] != '>' || self.rawContent[0] == ':') {
            self.fileContent += self.rawContent[0];
            self.rawContent = self.rawContent.substr(1);
            break;
        }
        else if (self.rawContent[0] == ' '){
            self.fileContent += self.rawContent[0];
            self.rawContent = self.rawContent.substr(1);
        }else {
            return;
        }
    }
    var urlhead = self.rawContent[0];
    var plus = 0;
    // 查找链接的结束位置
    while (true) {
        mark++;
        if (mark > self.rawContent.length -1) {
            url = self.rawContent.substr(0, mark-1);
            self.rawContent = self.rawContent.substr(mark-1);
            break;
        }
        if (!isBgImage) {
            if(self.rawContent[mark] == '('){
                quotes++;
            }else if (self.rawContent[mark] == ')') {
                quotes--;
                if (quotes<0) {
                    quotes = 0;
                }
            }
        }

        if(quotes) continue;

        if (isBgImage && self.rawContent[mark] == ')') {
            url = self.rawContent.substr(0, mark);
            self.rawContent = self.rawContent.substr(mark);
            break;
        }

        if (self.rawContent[mark] == '\'' || self.rawContent[mark] == '"') {
            if(urlhead == self.rawContent[mark] && self.rawContent[mark - 1] != '\\' && self.rawContent[mark - 1] != '[' && self.rawContent[mark + 1] != ']') {
                self.fileContent += self.rawContent[0];
                url = self.rawContent.substr(1, mark-1);
                self.rawContent = self.rawContent.substr(mark);
                break;
            }
        }
        if (!isBgImage && !quotes && (self.rawContent[mark] == ';' || self.rawContent[mark] == '\n' ||  self.rawContent[mark] == ',')) {
            url = self.rawContent.substr(0, mark);
            self.rawContent = self.rawContent.substr(mark);
            break;
        }

    }
    /*如果是背景图片，并且没有协议，说明是相对路径，直接跳过(todo bug: 如果语境是js，那么这个判断会失效)
    if (isBgImage && !url.match(/((http|https)\:)?\/\//g)) {
        return;
    };*/
    var fixedUrl = self.fixUrl(url);
    if (fixedUrl === false) {
        self.error_result.push('case' + (self.error_result.length+1)
        + ': line ' + self.fileContent.split('\n').length + ' --> ' + url
        + '\n\t ....' + self.fileContent.substr(-20) + url + self.rawContent.substr(0, 20) + '....');
        self.fileContent += url;
    } else {
        self.fileContent += fixedUrl;
    }
    this.caseNumber++;
}
var hp = new https();
exports.check = function (content, file, hostmap, mode) {
    if (mode == 'fix') {
        if (content.indexOf('skip fis-parse-protocolfix') != -1) {
            return content.replace(/\|protocol_none/gm, '');
        } else {
            hp.setFileInfo(file);
            // 逐字扫描文件
            return hp.parse(content, hostmap, mode);
        }
    } else if (mode == 'remove') {
        content = content.replace(/\|protocol_none/gm, '');
        return content.replace(/(__protocol|\|protocol)/gm, '');
    }
}
