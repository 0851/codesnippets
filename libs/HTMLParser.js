/**
   *
   * 查找到最近的下标
   *
   * @param {any} arr 数组
   * @param {any} searchElement 搜索源
   * @param {any} fromIndex 从第几个下标开始
   * @returns {number} 下标
   */
function indexOf(arr, searchElement, fromIndex) {
  var index = -1;
  fromIndex = fromIndex * 1 || 0;

  for (var k = 0, length = arr.length; k < length; k++) {
    if (k >= fromIndex && arr[k] === searchElement) {
      index = k;
      break;
    }
  }
  return index;
};
/**
   *
   * @param {string} html - 待处理html字符串
   * @param {object}  handler  - 处理数据的方法集合
   * @param {function}  handler['start'] - 处理开始标签数据的方法 , 入参 (tag , attrs[{name,value,escaped}] , unary)
   * @param {function}  handler['end'] - 处理结束标签数据的方法 , 入参 (tag)
   * @param {function}  handler['chars'] - 处理字符串数据的方法 , 入参 (text)
   * @param {function}  handler['comment'] - 处理注释数据的方法 , 入参 (text)
   * 嵌套规则来源 - https://menggeniu.github.io/2016/06/17/41/
   */

function HTMLParser(html, handler) {
  html = html || ''
  handler = handler || {
    // 匹配注释
    comment: function (text) {},
    // 匹配字符串
    chars: function (text) {},
    // true代表自闭和标签 , 同时不会触发end函数
    start: function (tag, attrs, unary) {},
    // 匹配闭合标签
    end: function (tag) {}
  }
  //匹配注释
  var regexpComment = /^<!--\s*(\S*?)\s*-->/;
  //匹配文本节点
  var regexpChars = /(\s*)([^<]*?)(\s*)(?=<|$)/;
  //第一个匹配项为标签名 , 第二个匹配项为所有的attr , 第三个匹配项为是否是自闭合标签
  var regexpStart = /^<(\w+)\s*((?:[^>](?=['"])*?(['"])[^\3]*?\3|[^>](?!['"])??)*?)\s*?(\/?)>/
  //第一个匹配项为闭合标签
  var regexpEnd = /^<\/([-A-Za-z0-9_]+)[^>]*>/
  //第一个匹配项为attr名 , 第二个匹配项为value 的包裹引号 , 第三个匹配项是存在引号时的value值 , 第四个匹配项是不存在引号时的value
  var regexpAttr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:(?:\s*=\s*)(?:(?:(['"])([^\2]*?)\2)|(\S+)))?/g
  // 自闭和标签
  var empty = 'area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keyge' +
      'n,source,track,wbr'
  // 用来判断是否可以被嵌套
  var block = 'address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,di' +
      'v,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header' +
      ',hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,p' +
      're,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video'
  // 内部不允许嵌套block内容的标签
  var inline = 'a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,i' +
      'frame,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strik' +
      'e,strong,sub,sup,textarea,tt,u,var'
  // 允许重复的标签
  var closeSelf = 'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr'
  // attr属性值
  var fillAttrs = 'checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,no' +
      'wrap,readonly,selected'
  var special = 'script,style'

  //定义一个stack 存储未闭合标签
  var stack = []
  var last = html
  //得到栈顶
  stack.top = function () {
    return this[0]
  }
  var inTags = function (tag, tags) {
    return new RegExp('(^|,)' + tag + '(,|$)').test(tags)
  }
  /**
     * 匹配到关闭标签时执行函数
     *
     * @param {any} tagName
     */
  var tagCloseHandle = function (tagName) {
    var pos = stack.length - 1 //默认是栈低 , 闭合全部未闭合的标签
    //如果存在tag , 查找对应在stack栈 出口位置最近的tag
    if (tagName) {
      tagName = tagName.toLowerCase()
      pos = indexOf(stack, tagName)
    }
    if (pos >= 0) {
      var i = 0
      // 直到目标节点索引终止
      while (i <= pos) {
        var node = stack.shift()
        handler.end(node)
        i++
      }
    }
  }

  /**
     *
     * 匹配到节点开始的执行函数
     *
     * @param {any} tagName
     * @param {any} attrs
     * @param {any} unary
     */
  var tagStartHandle = function (tagName, attrs, unary) {
    tagName = tagName.toLowerCase()
    if (inTags(tagName, block)) {
      // 如果新开始的标签是可嵌套,同时栈底标签是不允许嵌套别的标签的标签 ,首先先闭合此标签
      while (stack.top() && inTags(stack.top(), inline)) {
        tagCloseHandle(stack.top())
      }
    }
    if (inTags(tagName, closeSelf) && stack.top() === tagName) { // 允许重复的标签,连续出现 必须先行闭合
      tagCloseHandle(tagName)
    }

    var attrsArr = []
    attrs.replace(regexpAttr, function (match, attrname, quotes, attrvalue1, attrvalue2) {
      var attrvalue = (attrvalue1 || attrvalue2)
      attrvalue = attrvalue
        ? attrvalue
        : ''
      attrsArr.push({
        name: attrname,
        value: attrvalue,
        escaped: attrvalue.replace(/(^|[^\\])"/g, '$1\\"')
      })
    })
    // 匹配到自闭合标签 , 或者是属于默认自闭和标签
    unary = inTags(tagName, empty) || !!unary
    // 真代表自闭和标签 , 同时不会触发end函数
    handler.start(tagName, attrsArr, unary)
    if (!unary) {
      // 不属于自闭合标签的压到栈顶部
      stack.unshift(tagName)
    }
  }

  while (html) {
    //如果栈顶是script 或者 style 做字符串处理
    if (inTags(stack.top(), special)) {
      var topReg = new RegExp('(.*?)</\\s*' + stack.top() + '\\s*>')
      if (topReg.test(html)) {
        html = html.replace(topReg, function (all, text) {
          text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1$2')
          handler.chars(text, stack.top())
          return ''
        })
      } else {
        throw new Error('Error : ' + stack.top() + '没有找到对应的结束标签 , 请检查')
      }
      tagCloseHandle(stack.top())
    } else {
      var stringDismantling = function (index) {
        html = html.substring(index)
      }
      var commetMatched = html.match(regexpComment)
      var startMatched = html.match(regexpStart)
      var endMatched = html.match(regexpEnd)
      var charsMatched = html.match(regexpChars)
      if (commetMatched) {
        handler.comment(commetMatched[1])
        stringDismantling(commetMatched[0].length)
        continue
      }
      if (startMatched) {
        tagStartHandle(startMatched[1], startMatched[2], startMatched[4])
        stringDismantling(startMatched[0].length)
        continue
      }
      if (endMatched) {
        tagCloseHandle(endMatched[1])
        stringDismantling(endMatched[0].length)
        continue
      }
      var text = charsMatched[2] || (charsMatched[1]
        ? ''
        : html)
      var dismantling = charsMatched[0].length || html.length
      if (text) {
        handler.chars(text, stack.top())
      }
      stringDismantling(dismantling)
    }
    if (html === last) {
      throw new Error('Error : ' + html + '  上一次 : ' + last)
    }
    last = html
  }
  // 闭合栈中未闭合的所有标签
  tagCloseHandle()
}
