# codesnippets
代码片段

1. 增加vue highcharts组件  **./HChart.vue**
2. 增加vue dropdown组件  **./DropDown.vue**
3. 增加事件绑定lib  **./libs/event.js**
4. 增加获取dom元素位置lib **./libs/offset.js**
5. 增加html解析器
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
