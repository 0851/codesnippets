/**
 * Created by Lynn on 2017/6/26.
 * 验证器
 * 参数格式
 * { 'key' : [?{valid:String,handle:Function|null,arg:Function|String,message:String|Function,watch:Boolean}]? }
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
      res = Object.keys(val).length > 0
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
const validator = {
  created () {
    this.$setValidation()
  },
  data () {
    return {
      valid$: Object.assign({}, defaultValid)
    }
  },
  computed: {
    $validation () {
      const self = this
      if (!_.isObject(self.$$validation)) {
        return {}
      }
      return {
        getValidSet(key) {
          const $$validOptions = self.$$validation[key]
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
        },
        reset() {
          return new Promise(function (resolve, reject) {
            try {
              self.valid$ = Object.assign({}, defaultValid)
              self.$nextTick(() => {
                resolve.call(self)
              })
            } catch (e) {
              reject(e)
            }
          })
        },
        valid: (valid) => {
          return new Promise(function (resolve, reject) {
            if (!valid) {
              Object.keys(self.$$validation).forEach(validOne)
            } else {
              validOne(valid)
            }
            function validOne (valid) {
              const value = _.get(self, valid, null)
              const $$validSet = self.$validation.getValidSet(valid)
              if ($$validSet.length <= 0) {
                return
              }
              function changeBefore$Valid () {
                self.valid$[valid]['$init'] = false
                self.valid$[valid]['$run'] = true
                self.valid$[valid]['$error'] = {}
                self.valid$['$init'] = false
                delete self.valid$['$error'][valid]
              }

              function change$ValidIng (validResult, validKey, message) {
                if (validResult === false) {
                  self.valid$[valid]['$error'][validKey] = message
                  self.valid$['$error'][valid] = self.valid$['$error'][valid] || {}
                  self.valid$['$error'][valid][validKey] = message
                  self.valid$[valid]['$firstError'] || (self.valid$[valid]['$firstError'] = message)
                }
                self.valid$[valid]['$run'] = false
              }

              function changeAfter$Valid () {
                let $validOne = Object.keys(self.valid$[valid]['$error']).length <= 0
                let $valid = Object.keys(self.valid$['$error']).length <= 0
                let $run = false
                Object.keys(self.valid$).forEach(function (v) {
                  if (_.isObject(self.valid$[v]) && self.valid$[v]['$run'] === true) {
                    $run = true
                    return
                  }
                })
                self.valid$[valid]['$valid'] = $validOne
                self.valid$['$valid'] = $valid
                self.valid$['$run'] = $run
              }

              function createPromiseSet (set) {
                changeBefore$Valid()
                const validPromiseSet = []
                set.forEach(optionsHandle)
                function optionsHandle (options) {
                  if (!_.isObject(options)) {
                    return
                  }
                  let validHandle = () => {}
                  const validKey = options.valid
                  if (validators[validKey]) {
                    validHandle = validators[validKey]
                  }
                  if (_.isFunction(options.handle)) {
                    validHandle = options.handle
                  }
                  let arg = options.arg
                  if (_.isFunction(options.arg)) {
                    arg = options.arg.call(self)
                  }
                  let message = options.message
                  if (_.isFunction(options.message)) {
                    message = options.message.call(self)
                  }

                  const promise = new Promise(function (resolve, reject) {
                    try {
                      if (_.isFunction(validHandle.then)) {
                        validHandle(value, arg).then(function (validResult) {
                          change$ValidIng(validResult, validKey, message)
                          resolve({
                            valid: validResult,
                            message: message
                          })
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

              Promise.all(createPromiseSet($$validSet)).then(function () {
                changeAfter$Valid()
                resolve(self.valid$)
              }, function (e) {
                reject(e)
              })
            }
          })
        }
      }
    }
  },
  methods: {
    $setValidation ($$validation = this.$options.validation) {
      if (!_.isObject($$validation)) {
        return
      }
      const self = this
      self.$$validation = $$validation
      self.$$validationWatch = {}
      const setWatch = function (valid) {
        const self = this
        return self.$watch(valid, _.debounce(function (value, old) {
          if (value === old) {
            return
          }
          self.$validation.valid(valid)
        }, 150))
      }
      Object.keys($$validation).forEach(function (valid) {
        if (!self.$$validationWatch[valid]) {
          self.$$validationWatch[valid] = {}
        }
        if (!self.valid$[valid]) {
          self.$set(self.valid$, valid, Object.assign({$firstError: ''}, defaultValid))
        }
        const isWatch = _.find(self.$validation.getValidSet(valid), function (v) {
          return v.watch === false
        })
        if (isWatch) {
          return
        }
        if (self.$$validationWatch[valid]['$watch']) {
          self.$$validationWatch[valid]['$watch']()
        }
        self.$$validationWatch[valid]['$watch'] = setWatch.call(self, valid)
      })
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
