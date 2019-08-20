<template>
  <div class="container" @click="playNext">
    <div
      v-for="(row, ind) in storiesChapters"
      :key="`chapter-${ind}`"
      class="chapter"
    >
      <h2> {{ row.chapter }}</h2>
      <div class="quotes-container">
        <QuotePlayer
          v-for="(quote, indd) in storiesData"
          :key="`${quote.Title}-${indd}`"
          :quote-data="quote"
          :is-active="currQuote === indd"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { csvParse } from 'd3-dsv'
import { group } from 'd3-array'
import QuotePlayer from '~/components/QuotePlayer.vue'
const DURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaEu4kTlAHyqAV-vIHBHIgOoJtoSzHYDZlvbs6ryP4w1YQTJDDWYGULgecXp9O-JP9fAbm3NqzgJV_/pub?output=csv'
export default {
  components: {
    QuotePlayer
  },
  data () {
    return {
      currQuote: -1
    }
  },
  async asyncData (ctx) {
    // const slug = await ctx.params.slug
    const csvdata = await fetch(DURL)
      .then(d => d.text())
      .then(d => csvParse(d))
      .then(d => d.filter(e => e.Audio_Source !== 'noaudio'))
    const storiesChapters = Array.from(group(csvdata, e => e.Chapter),
      ([key, value]) => ({ chapter: key, stories: value }))
    return {
      storiesData: csvdata,
      storiesChapters
    }
  },
  methods: {
    playNext () {
      this.currQuote = (this.currQuote + 1) % this.storiesData.length
    }
  }
}
</script>

<style lang="scss" scoped>
.quotes-container{
  position: relative;
  overflow: hidden;
}

</style>
