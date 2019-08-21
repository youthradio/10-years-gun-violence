<template>
  <div class="container" @click="playNext">
    <article>
      <p>
        Guns are a dominant force in young people’s lives, whether through direct experiences of gun violence in their communities, regularly scheduled “live shooter” lockdowns that are the new normal to prepare for school shootings, because they advocate for gun access or fight for gun policy reform, or because they are targeted by police violence aimed at black and brown youth.
      </p>
      <p>
        YR has been telling stories about guns in
        young people’s lives for more than 25 years — in fact reporting on homicides in the San Francisco Bay Area was the impetus to establish the organization in 1992. We sampled from the past 10 years of our archive to tell a different kind of gun story. We bring you a collection of voices that shows the huge range of perspectives young people bring to gun violence. The conversation can be overwhelming and that is part of the experience we aim to capture here, as well as the phenomenon we’ve noticed, that every time a national event takes place related to guns, one point of focus takes all the attention — this month’s mass shootings in El Paso, Texas and Dayton, Ohio are the latest example — and the rest of the voices are drowned out. In this interactive, we aim to keep the range of voices in play, so as a community we remember all the different ways that guns touch our lives, even when a singular event draws our attention to one devastating act of violence.
      </p>
    </article>
    <div
      v-for="(chapterRow, chapterID) in storiesChapters"
      :key="`chapter-${chapterID}`"
      class="chapter"
    >
      <h2> {{ chapterRow.chapter }}</h2>
      <div ref="quotesContainer" class="quotes-container">
        <QuotePlayer
          v-for="(quote, ind) in chapterRow.stories"
          :key="`quote-${getQuoteIndex(chapterID, ind)}`"
          :quote-data="quote"
          :is-active="currQuote === getQuoteIndex(chapterID, ind)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { csvParse } from 'd3-dsv'
import { group } from 'd3-array'
import QuotePlayer from '~/components/QuotePlayer.vue'
const DURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaEu4kTlAHyqAV-vIHBHIgOoJtoSzHYDZlvbs6ryP4w1YQTJDDWYGULgecXp9O-JP9fAbm3NqzgJV_/pub?gid=0&single=true&output=csv'
export default {
  components: {
    QuotePlayer
  },
  data () {
    return {
      currQuote: 0
    }
  },
  computed: {
    totalStories () {
      return this.storiesChapters.reduce((acc, e) => acc + e.length, 0)
    }
  },
  async asyncData (ctx) {
    // const slug = await ctx.params.slug
    const csvdata = await fetch(DURL)
      .then(d => d.text())
      .then(d => csvParse(d))
      .then(d => d.filter(e => e.Audio_Source !== 'noaudio'))
    const storiesChapters = Array.from(group(csvdata, e => e.Chapter),
      ([key, value]) => ({ chapter: key, stories: value, length: value.length }))
    return {
      storiesChapters
    }
  },
  mounted () {
    this.setParentsHeight()
    window.addEventListener('resize', this.setParentsHeight)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setParentsHeight)
  },
  methods: {
    playNext () {
      this.currQuote = (this.currQuote + 1) % this.totalStories
    },
    getQuoteIndex (chapterID, ind) {
      return ind + (chapterID > 0 ? this.storiesChapters[chapterID - 1].length : 0)
    },
    setParentsHeight () {
      this.$refs.quotesContainer.forEach((container) => {
        const containerY = container.getBoundingClientRect().y
        const maxheight = Math.max(...Array.from(container.children).map(e => e.getBoundingClientRect().height + e.getBoundingClientRect().y - containerY + 50))
        container.style.height = `${maxheight}px`
      })
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
article{
  max-width: 40em;
  margin:auto;

}
.container{
}
</style>
