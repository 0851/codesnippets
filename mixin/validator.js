/**
 * Created by Lynn on 2017/6/26.
 * 验证器
 * 注册 vue mixin
 * 使用方式 , vue 组件中添加 validation 参数 格式
   validation: {
    'name': [
      {
        valid: 'required',//valid 可以是validators验证器中的字符串, 也可以自定义函数 , 支持promise
        message: '名称为必填'
      }
    ]
  }
 * 验证结果
 {
    '$init': true, // 原始
    '$valid': undefined, // 有效
    '$run': false, // 检查中
    '$error': {} // 错误列表
 }
 * 提供方法 this.$validation.valid 验证 , 可以指定 key
 * 提供方法 this.$validation.reset 重置验证
 */
import _ from 'lodash'
const validators = { // 结果真代表通过
  required: (val) => { // 必填
    let res = false
    if (Array.isArray(val)) {
      res = val.length > 0
    } else if (typeof val === 'number') {
      res = true
    } else if (typeof val === 'boolean') {
      res = val
    } else if (typeof val === 'string') {
      res = val.length > 0
    } else if (val !== null && typeof val === 'object') {
      res = Object
        .keys(val)
        .length > 0
    } else if (val === null || val === undefined) {
      res = false
    }
    return res
  },

  numeric: (val = '') => { // 数字
    const res = (/^-?(?:0$0(?=\d*\.)|[1-9]|0)\d*(\.\d+)?$/).test(val)
    return res
  },

  integer: (val = '') => { // 整数
    const res = (/^(-?[1-9]\d*|0)$/).test(val)
    return res
  },

  positive: (val = '') => { // 正整数
    const res = (/^\+?[1-9][0-9]*$/).test(val)
    return res
  },

  digits: (val = '') => { // 小数
    const res = (/^[\d() .:\-+#]+$/).test(val)
    return res
  },

  alpha: (val = '') => { // 字母
    const res = (/^[a-zA-Z]+$/).test(val)
    return res
  },

  alphaNum: (val = '') => { // 数字或者字母
    const res = (/^[a-zA-Z0-9]+$/).test(val)
    return res
  },

  email: (val = '') => { // email
    const res = (/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i).test(val)
    return res
  },

  phone: (val = '') => { // 手机号
    const res = !!val.match(/^(0|86|17951)?(13|15|17|18|14)[0-9]{9}$/)
    return res
  },

  url: (val = '') => { // url地址
    const res = (/^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i).test(val)
    return res
  },

  minLength: (val, arg) => { // 最大长度
    const res = val && val.length && val.length >= +arg
    return res
  },

  maxLength: (val = '', arg) => { // 最大长度
    const res = val.length <= +arg
    return res
  },

  minMaxLength: (val = '', arg) => { // 最大长度
    const max = val.length <= +arg.max
    const min = val.length >= +arg.min
    return min && max
  },

  length: (val, arg) => { // 长度
    const res = val && val.length === +arg
    return res
  },

  min: (val, arg) => { // 最小
    const res = val >= +arg
    return res
  },

  max: (val, arg) => { // 最大
    const res = val <= +arg
    return res
  },

  pattern: (val, arg) => { // 匹配规则
    const match = arg.match(new RegExp('^/(.*?)/([gimy]*)$'))
    const regex = new RegExp(match[1], match[2])
    const res = regex.test(val)
    return res
  },
  domain: (val) => {
    const regex = /^[a-z0-9A-Z\u4E00-\u9FA5][-a-zA-Z0-9\u4E00-\u9FA5]{0,62}(.[a-zA-Z0-9\u4E00-\u9FA5][-a-zA-Z0-9\u4E00-\u9FA5]{0,62})*(.[a-zA-Z\u4E00-\u9FA5]+)$/
    const res = regex.test(val)
    return res
  },
  ip: (val) => {
    const regex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/
    const res = regex.test(val)
    return res
  },
  name: (val = '') => { // 中英文数字以及 - _ .
    const regex = new RegExp('^[A-Za-z0-9\u4e00-\u9fa5-_.]+$', 'g')
    const res = regex.test(val)
    return res
  }
}
const defaultValid = {
  '$init': true, // 原始
  '$valid': undefined, // 有效
  '$run': false, // 检查中
  '$error': {} // 错误列表
}
const setWatch = function (valid) {
  const self = this
  return self.$watch(valid, function (value, old) {
    if (value === old) {
      return
    }
    self
      .$validation
      .valid(valid)
  })
}
function getValidSet ($$validation, key) {
  const $$validOptions = $$validation[key]
  let $$validSet = []
  if (!_.isArray($$validOptions) && !_.isObject($$validOptions)) {
    return $$validSet
  }
  if (_.isObject($$validOptions)) {
    $$validSet = [$$validOptions]
  }
  if (_.isArray($$validOptions)) {
    $$validSet = $$validOptions
  }
  return $$validSet
}
function validDataGenerator () {
  const self = this
  const $$validation = self.$options.validation
  const result = Object.assign({}, defaultValid)
  if (!_.isObject($$validation)) {
    return
  }
  Object
    .keys($$validation)
    .forEach(function (valid) {
      if (!result[valid]) {
        result[valid] = Object.assign({
          $firstError: ''
        }, defaultValid)
      }
    })
  return result
}
function bindWatch () {
  const self = this
  self.$$validationWatch = self.$$validationWatch || {}
  const $validation = self.$options.validation
  Object
    .keys($validation)
    .forEach(function (valid) {
      if (!self.$$validationWatch[valid]) {
        self.$$validationWatch[valid] = {}
      }
      const isWatch = _.find(getValidSet($validation, valid), function (v) {
        return v.watch === false
      })
      if (isWatch) {
        return
      }
      self.$$validationWatch[valid]['$watch'] && self.$$validationWatch[valid]['$watch']()
      self.$$validationWatch[valid]['$watch'] = setWatch.call(self, valid)
    })
}
function unBindWatch () {
  const self = this
  if (!self.$$validationWatch || Object.keys(self.$$validationWatch).length <= 0) {
    return
  }
  Object
    .keys(self.$$validationWatch)
    .forEach(function (valid) {
      self.$$validationWatch[valid]['$watch'] && self.$$validationWatch[valid]['$watch']()
    })
}
function safeGet (p, o, defaultString) {
  p = p.split('.')
  return p.reduce(function (xs, x) {
    return (xs && xs[x])
      ? xs[x]
      : defaultString || null
  }, o)
}
const validator = {
  data () {
    return {
      valid$$$: validDataGenerator.call(this)
    }
  },
  beforeDestroy () {
    unBindWatch.call(this)
  },
  computed: {
    $validation () {
      const self = this
      const $$validation = self.$options.validation
      if (!_.isObject($$validation)) {
        throw new Error('需要使用验证方法 必须存在$$validation')
      }
      unBindWatch.call(self)
      bindWatch.call(self)
      return {
        getKey (key) {
          const result = key === undefined
            ? self['valid$$$']
            : self['valid$$$'][key] || {}
          return result
        },
        getValidSet (key) {
          return getValidSet($$validation, key)
        },
        reset () {
          unBindWatch.call(self)
          self['valid$$$'] = validDataGenerator.call(self)
          bindWatch.call(self)
        },
        valid: (valid) => {
          return new Promise(function (resolve, reject) {
            if (!valid) {
              Object
                .keys($$validation)
                .forEach(validOne)
            } else {
              validOne(valid)
            }
            function validOne (key) {
              const value = safeGet(key, self, null)
              const $$validSet = self
                .$validation
                .getValidSet(key)
              if ($$validSet.length <= 0) {
                return
              }
              function changeBefore$Valid () {
                self['valid$$$'][key]['$init'] = false
                self['valid$$$'][key]['$run'] = true
                self['valid$$$'][key]['$error'] = {}
                self['valid$$$'][key]['$firstError'] = ''
                self['valid$$$']['$init'] = false
                delete self['valid$$$']['$error'][key]
              }

              function change$ValidIng (validResult, validKey, message) {
                if (validResult === false) {
                  self['valid$$$'][key]['$error'][validKey] = message
                  self['valid$$$']['$error'][key] = self['valid$$$']['$error'][key] || {}
                  self['valid$$$']['$error'][key][validKey] = message
                  self['valid$$$'][key]['$firstError'] = self['valid$$$'][key]['$firstError'] || message
                }
                self['valid$$$'][key]['$run'] = false
              }

              function changeAfter$Valid () {
                let $validOne = Object
                  .keys(self['valid$$$'][key]['$error'])
                  .length <= 0
                let $valid = Object
                  .keys(self['valid$$$']['$error'])
                  .length <= 0
                let $run = false
                Object
                  .keys(self['valid$$$'])
                  .forEach(function (v) {
                    if (_.isObject(self['valid$$$'][v]) && self['valid$$$'][v]['$run'] === true) {
                      $run = true
                    }
                  })
                self['valid$$$'][key]['$valid'] = $validOne
                self['valid$$$']['$valid'] = $valid
                self['valid$$$']['$run'] = $run
              }

              function createPromiseSet (set) {
                changeBefore$Valid()
                const validPromiseSet = []
                set.forEach(optionsHandle)
                function optionsHandle (options) {
                  if (!_.isObject(options)) {
                    return
                  }
                  let validHandle
                  const validKey = options.valid
                  if (validators[validKey]) {
                    validHandle = validators[validKey]
                  }
                  if (_.isFunction(options.handle || options.valid)) {
                    validHandle = options.handle || options.valid
                  }
                  if (!validHandle) {
                    return
                  }
                  let arg = options.arg
                  if (_.isFunction(options.arg)) {
                    arg = options
                      .arg
                      .call(self)
                  }
                  let message = options.message
                  if (_.isFunction(options.message)) {
                    message = options
                      .message
                      .call(self)
                  }

                  const promise = new Promise(function (resolve, reject) {
                    try {
                      if (_.isFunction(validHandle.then)) {
                        validHandle(value, arg)
                          .then(function (validResult) {
                            change$ValidIng(validResult, validKey, message)
                            resolve({valid: validResult, message: message})
                          })
                      } else {
                        change$ValidIng(validHandle(value, arg), validKey, message)
                        resolve({
                          valid: validHandle(value, arg),
                          message: message
                        })
                      }
                    } catch (e) {
                      reject(e)
                    }
                  })
                  validPromiseSet.push(promise)
                }

                return validPromiseSet
              }

              Promise
                .all(createPromiseSet($$validSet))
                .then(function () {
                  changeAfter$Valid()
                  resolve(self['valid$$$'])
                }, function (e) {
                  reject(e)
                })
            }
          })
        }
      }
    }
  }
}
const install = function (Vue, options) {
  Vue.mixin(validator)
}
export default {
  install,
  validator
}
