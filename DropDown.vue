<!-- @components Dropdown.vue -->
<!-- created by wangjianliang on Mon Jun 12 2017 -->
<template>
  <div class="dropdown-wrap">
    <div class="dropdown" v-if="method=='hover'" ref='dropdown' @mouseenter.stop.prevent="toggle(true)" @mouseleave.stop.prevent="toggle(false)">
      <div class="d-header">
        <slot name="d-header"></slot>
      </div>
      <transition name="fade" mode="out-in" appear>
        <div class="d-content" ref="content" @click.stop @mouseenter.stop.prevent="toggle(true)" @mouseleave.stop.prevent="toggle(false)"
          v-show="isShow">
          <slot name="default"></slot>
        </div>
      </transition>
    </div>
    <div v-else class="dropdown" ref='dropdown' @click.stop.prevent="toggle(!isShow)">
      <div class="d-header">
        <slot name="d-header"></slot>
      </div>
      <transition name="fade" mode="out-in" appear>
        <div class="d-content clearfix font-base" ref="content" @click.stop v-show="isShow">
          <slot name="default"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>
<style>
  /* global styles */

</style>

<style scoped lang="less">
  /* local styles */

  .dropdown-wrap {
    position: relative;
    width: inherit;
    display: inherit;
  }

  .dropdown {
    position: relative;
    width: inherit;
    display: inherit;
    max-width: 300px;
  }

  @offset : 3px;
  @color :#666;
  @percentage :30%;
  .d-content {
    position: fixed;
    min-width: 100%;
    z-index: 100000000;
    display: inline-block;
    transition: all .3 ease;

    box-shadow: 0 @offset (@offset+1px)*2 fade(@color, @percentage);
  }

</style>
<script>
  import event from './libs/event'
  import offset from './libs/offset'

  export default {
    props: {
      method: {
        type: String,
        default () {
          return 'click'
        }
      }
    },
    data () {
      return {
        isShow: false
      }
    },
    mounted () {
      this.createWrap()
      this.move2Body()
    },
    beforeDestroy () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.unbind()
      this.leave2Body()
    },
    methods: {
      createWrap () {
        this.dropdownbody = document.querySelector('#dropdownbody')
        if (!this.dropdownbody) {
          this.dropdownbody = window.document.createElement('div')
          this.dropdownbody.id = 'dropdownbody'
          document.body.appendChild(this.dropdownbody)
        }
      },
      move2Body () {
        const self = this
        const content = self.$refs.content
        this.dropdownbody.appendChild(content)
      },
      leave2Body () {
        const self = this
        const content = self.$refs.content
        this.dropdownbody.removeChild(content)
      },
      placeholder () {
        const self = this
        const dropdown = self.$refs.dropdown
        const content = self.$refs.content
        const area = offset.offset(dropdown)
        content.style['top'] = area.offsetTop + area.height + 3 + 'px'
        content.style['left'] = area.offsetLeft + 'px'
        content.style['minWidth'] = area.width + 'px'
      },
      bind () {
        event.on(document, 'click', this.close)
        event.on(window, 'scroll', this.placeholder, true)
      },
      unbind () {
        event.off(document, 'click', this.close)
        event.off(window, 'scroll', this.placeholder, true)
      },
      toggle (state) {
        const self = this
        if (self.timer) {
          clearTimeout(self.timer)
        }
        self.unbind()
        self.timer = setTimeout(function () {
          self.placeholder()
          self.isShow = state
          if (self.isShow === true) {
            self.bind()
            self.$emit('on-show', self.isShow)
          } else {
            self.unbind()
            self.$emit('on-hide', self.isShow)
          }
        }, 50)
      },
      close () {
        this.toggle(false)
      }
    }
  }
</script>
