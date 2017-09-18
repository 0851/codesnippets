/******************************************
 *  Author : wangjianliang
 *  Created On : Fri Jul 28 2017
 *  File : tpl.js
 *  Example : tpl(
  `
  [:if (title){:]
    [: for (var i=0;i<list.length;i++) { :]
      <div>[:=i:]. [:=this.list[i]:]</div>
    [:}:]
    [:=name || '没有名字':]
  [:}:]
  `,
  {
    title: '标签',
    list: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
  },
  {delimiter:['[:',':]']}
  )
 *******************************************/
/**
 * @param data {String} 模板数据
 * @return Function 编译模板
 */
function call(data = {}) {
  var key,
    keys = [],
    values = [];
  for (key in data) {
    if (data.hasOwnProperty(key) === true) {
      keys.push(key);
      values.push(data[key]);
    }
  };
  return (new Function(keys, call.$)).apply(data, values);
};
function escapeN(string = '') {
  return (string + '')
    .replace(/\'/g, "\\'")
    .replace(/\"/g, "\\'")
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\n')
}
function encodeReg(source) {
  return String(source).replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
}
/**
 * @param tpl {String}    模板字符串 , 内部可使用this访问数据 , 或者使用scope
 * @param data {Object}   模板数据（未找到返回渲染方法）
 * @return {String}|{Function}  渲染结果|渲染方法
 *
 */
function tpl(tpl, data, options = {
  delimiter: ['{{', '}}']
}) {
  call.$ = 'var result=\'\';';
  var reg = new RegExp('(.*?)' + encodeReg(options.delimiter[0]) + '(.+?)' + encodeReg(options.delimiter[1]) + '(.*?)', 'g');
  tpl.replace(reg, function (all, start, code, end) {
    call.$ += 'result+=\'' + escapeN(start) + '\';';
    var varReg = /^\s*\=\s*(.*)/;
    if (varReg.test(code)) {
      call.$ += 'result+=(' + code.replace(varReg, '$1') + ');'
    } else {
      call.$ += code.replace(/\r\n/g, '')
    }
    call.$ += 'result+=\'' + escapeN(end) + '\';';
  })
  call.$ += ';return result;';
  return data
    ? call(data)
    : call;
}
module.exports = tpl
