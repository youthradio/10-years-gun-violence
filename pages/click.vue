<template>
  <div class="container" @click="playNext">
    <article>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet porttitor risus. Ut sit amet diam facilisis, posuere urna eget, lobortis justo. Sed blandit, nisi rhoncus semper dapibus, nibh est laoreet neque, in porta diam dolor in risus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas arcu augue, viverra vitae varius vel, pulvinar et sapien. Pellentesque in molestie ex. Donec semper ullamcorper elit, et mattis ex pulvinar et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a massa diam. Curabitur scelerisque vestibulum sapien eget placerat. Nunc consectetur, eros quis tincidunt placerat, leo tortor porta urna, ut tempor quam lectus sit amet dolor. Integer arcu odio, aliquet nec magna et, hendrerit hendrerit sem.
      </p>
    </article>
    <div class="mute-button">
      <UnMuteButton :audio-context="audioContext" @mutedEvent="mutedEvent" />
    </div>
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
        />
      </div>
    </div>
  </div>
</template>

<script>
import { csvParse } from 'd3-dsv'
import { group } from 'd3-array'
import QuotePlayer from '~/components/QuotePlayer.vue'
import UnMuteButton from '~/components/UnMuteButton.vue'

const DURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaEu4kTlAHyqAV-vIHBHIgOoJtoSzHYDZlvbs6ryP4w1YQTJDDWYGULgecXp9O-JP9fAbm3NqzgJV_/pub?output=csv'
export default {
  components: {
    QuotePlayer,
    UnMuteButton
  },
  data () {
    return {
      current: {
        chapter: 0,
        quote: -1
      },
      controller: null
    }
  },
  computed: {
    totalStories () {
      return this.storiesChapters.reduce((acc, e) => acc + e.length, 0)
    },
    totalChapters () {
      return this.storiesChapters.length
    }
  },
  async asyncData (ctx) {
    // const slug = await ctx.params.slug
    const csvdata = await fetch(DURL)
      .then(d => d.text())
      .then(d => csvParse(d))
      .then(d => d.filter(e => e.File_Name !== 'noaudio'))
      .then(d => d.map(e => Object.assign({ isActive: false }, e)))

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
      const quotesLenght = this.storiesChapters[this.current.chapter].length - 1
      if (this.storiesChapters[this.current.chapter].stories[this.current.quote]) {
        this.storiesChapters[this.current.chapter].stories[this.current.quote].isActive = false
      }
      if (this.current.quote < quotesLenght) {
        this.current.quote++
      } else {
        this.current.quote = 0
        this.current.chapter = (this.current.chapter + 1) % this.totalChapters
      }
      this.storiesChapters[this.current.chapter].stories[this.current.quote].isActive = true
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
.mute-button{
  display: flex;
  justify-content: flex-end;
  position: sticky;
  right: 0px;
  top: 0px;
  z-index: 1000;
}
.quotes-container{
  position: relative;
  display: flex;
  justify-content: center;
}
article{
  max-width: 40em;
  margin:auto;
  // margin-bottom: 1em;
}
// .container{
// }
h2 {
  text-align: center;
}
</style>
