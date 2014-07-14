define(function(require, exports, module){
 var cache = {},
     w = (function() {
         return this || (0, eval)('this');
     }());

 function aTpl(str, data) {
     return data ? aTpl.compile(preCompile(str)).render(data) : aTpl.compile(str);
 }

 function preCompile(str) {
     var formatTpl, propArr;

     function unescape(code) {
         return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, ' ');
     }

     if (cache[str]) {
         propArr = cache[str].propList;
         formatTpl = cache[str].formatTpl;
     } else {
         formatTpl = (function(str) {
             var el = document.getElementById(str),
                 str = el ? el.innerHTML : str;

             return ("var out='" + (str.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, ' ').replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, ''))
                 .replace(/'|\\/g, '\\$&')
                 .replace(/<%(.+?)%>/g, function(m, code) {
                     return code.substring(0, 1) === '=' ? ("';out+=(" + unescape(code.substring(1)) + ");out+='") : ("';" + unescape(code) + "out+='");
                 }) + "';return out;")
                 .replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r')
                 .replace(/(\s|;|\}|^|\{)out\+='';/g, '$1').replace(/\+''/g, '')
                 .replace(/(\s|;|\}|^|\{)out\+=''\+/g, '$1out+=');

         })(str);

         cache[str] = {
             formatTpl: formatTpl,
             propList: propArr
         };
     }

     return str;
 }

 aTpl.compile = function(str) {

     return {
         code: str,
         render: function(data) {
             var fn,
                 valueArr = [],
                 propArr = [];

             if (Object.prototype.toString.call(str) === '[object Object]') { //是否预编译
                 var compile_data = str;
                 str = compile_data.code;
                 formatTpl = compile_data.formatTpl;
                 cache[str] = {
                     formatTpl: formatTpl
                 };
             }

             if (cache[str] && cache[str].propList) {
                 for (var i = 0, list = cache[str].propList, len = list.length; i < len; i++) {
                     valueArr.push(data[list[i]]);
                 }
             } else {
                 for (var p in data) {
                     propArr.push(p);
                     valueArr.push(data[p]);
                 }
                 cache[str].propList = propArr;
             }

             try {
                 fn = new Function(cache[str].propList, cache[str].formatTpl);
             } catch (e) {
                 if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
                 throw e;
             }
             return fn.apply(w, valueArr);
         }
     }
 };

 module.exports = aTpl;
});
