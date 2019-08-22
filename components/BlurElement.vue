<template>
  <div
    class="blur-container"
    @click="toggle"
  >
    <div>
      {{ element }}
    </div>
    <div
      v-for="n in num"
      :key="n"
      :style="animaStart"
    >
      <div :style="computeBlur(n)">
        {{ element }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    element: {
      type: String,
      require: true,
      default: null
    },
    num: {
      type: String,
      require: true,
      default: ''
    }
  },
  data () {
    return {
      animaON: false
    }
  },
  computed: {
    animaStart () {
      if (this.animaON) {
        return {
          opacity: 0.99,
          animation: `2000ms linear 0s 1 normal forwards running onKey `

        }
      } else {
        return {
          opacity: 0.01,
          animation: `2000ms linear 0s 1 normal forwards running offKey`
        }
      }
    }
  },
  methods: {
    toggle () {
      this.animaON = !this.animaON
    },
    computeBlur (n) {
      return {
        opacity: 0.99,
        filter: `blur(${n}px)`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.blur-container {
  position: relative;
  user-select: none;
  > div {
    position: absolute;
    top: 0px;
    left: 0px;
  }
}
div {
  font-size: 2em;
}

@keyframes onKey {
  0% {
    opacity: 0.01;
  }
  50% {
    opacity: 0.50;
  }
  100% {
    opacity: 0.99;
  }
}
@keyframes offKey {
  0% {
    opacity: 0.99;
  }
  50% {
    opacity: 0.50;
  }
  100% {
    opacity: 0.01;
  }
}
</style>
