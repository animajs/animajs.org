define(function(require, exports, module){
module.exports = function(str) {
    function unescape(code) {
        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
    }

    var formatTpl = ("var out='" + (str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, ' ').replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, ''))
        .replace(/'|\\/g, '\\$&')
        .replace(/<%(.+?)%>/g, function(m, code) {
            return code.substring(0, 1) === '=' ? ("';out+=(" + unescape(code.substring(1)) + ");out+='") : ("';" + unescape(code) + "out+='");
        }) + "';return out;")
        .replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')
        .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, '')
        .replace(/(\s|;|\}|^|\{)out\+=''\+/g, '$1out+=');

    return JSON.stringify({
        code: str,
        formatTpl: formatTpl
    })
}
});
