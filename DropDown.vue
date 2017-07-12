<!-- @components Dropdown.vue -->
<!-- created by wangjianliang on Mon Jun 12 2017 -->
<template>
  <div class="dropdown"
       v-if="method=='hover'"
       ref='dropdown'
       @mouseenter.stop.prevent="toggle(true)"
       @mouseleave.stop.prevent="toggle(false)">
    <div class="d-header">
      <slot name="d-header"></slot>
    </div>
    <transition name="fade"
                mode="out-in"
                appear>
      <div class="d-content"
           ref="content"
           @click.stop
           @mouseenter.stop.prevent="toggle(true)"
           @mouseleave.stop.prevent="toggle(false)"
           v-show="isShow">
        <slot name="default"></slot>
      </div>
    </transition>
  </div>
  <div v-else
       class="dropdown"
       ref='dropdown'
       @click.stop.prevent="toggle(!isShow)">
    <div class="d-header">
      <slot name="d-header"></slot>
    </div>
    <transition name="fade"
                mode="out-in"
                appear>
      <div class="d-content clearfix"
           ref="content"
           @click.stop
           v-show="isShow">
        <slot name="default"></slot>
      </div>
    </transition>
  </div>
</template>
<style>
/* global styles */
</style>

<style scoped lang="less">
/* local styles */

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
import event from '../libs/event'
import offset from '../libs/offset'

let dropdownbody = document.querySelector('#dropdownbody')
if (!dropdownbody) {
  dropdownbody = window.document.createElement('div')
  dropdownbody.id = 'dropdownbody'
  document.body.appendChild(dropdownbody)
}

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
    this.bind()
    this.move2Body()
  },
  beforeDestroy () {
    this.unbind()
    this.leave2Body()
  },
  methods: {
    move2Body () {
      const self = this
      const content = self.$refs.content
      dropdownbody.appendChild(content)
    },
    leave2Body () {
      const self = this
      const content = self.$refs.content
      dropdownbody.removeChild(content)
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
      event.on(window, 'click', this.close)
    },
    unbind () {
      event.off(window, 'click', this.close)
    },
    toggle (state) {
      const self = this
      self.placeholder()
      if (self.timer) {
        clearTimeout(self.timer)
      }
      self.timer = setTimeout(function () {
        self.isShow = state
      }, 50)
    },
    close () {
      this.isShow = false
    }
  }
}
</script>
