<template>
  <div class="container">
    <ul>
      <li>
        <nuxt-link to="/click">
          Gun - Click
        </nuxt-link>
      </li>
      <li>
        <nuxt-link to="/scroll">
          Gun - Scroll
        </nuxt-link>
      </li>
    </ul>
    <div>
      <h2 ref="header">
        Test
      </h2>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    createBlurAnimation () {

    }
  }
}
</script>

<style lang="scss" scoped>

.quotes-container{
  position: relative;
  display: flex;
  justify-content: center;
}
</style>
