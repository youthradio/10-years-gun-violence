<template>
  <div class="container">
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
      ref="chapters"
      class="chapter"
    >
      <h2> {{ chapterRow.chapter }}</h2>
      <div
        ref="quotesContainer"
        class="quotes-container"
      >
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

const DURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaEu4kTlAHyqAV-vIHBHIgOoJtoSzHYDZlvbs6ryP4w1YQTJDDWYGULgecXp9O-JP9fAbm3NqzgJV_/pub?output=csv'
export default {
  components: {
    QuotePlayer
  },
  data () {
    return {
      current: {
        chapter: -1,
        quote: -1
      },
      scrollState: null,
      controller: null,
      scenes: []
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
  watch: {
    // current: {
    //   handler (newVal, oldVal) {
    //     console.log(this.scrollState, newVal.chapter, newVal.quote, oldVal.chapter, oldVal.quote)
    //     if (this.scrollState === 'FORWARD') {
    //       const chapterData = this.storiesChapters[newVal.chapter]
    //       chapterData.stories[newVal.quote].isActive = true
    //     } else if (this.scrollState === 'REVERSE') {
    //       const chapterData = this.storiesChapters[oldVal.chapter]
    //       chapterData.stories[oldVal.quote].isActive = false
    //     }
    //   },
    //   deep: true
    // }
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
    this.controller = new this.$ScrollMagic.Controller()
    this.createScenes()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setParentsHeight)
  },
  methods: {
    playNext () {
      const quotesLenght = this.storiesChapters[this.current.chapter].length - 1
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
    },
    createScenes () {
      this.$refs.chapters.forEach((chapterRef, chapterID) => {
        const scene = new this.$ScrollMagic.Scene({
          // triggerHook: 'onLeave',
          offset: chapterRef.getBoundingClientRect().height / 2,
          duration: 2000
        })
        scene.triggerElement(chapterRef)
          .setPin(chapterRef)
          .addTo(this.controller)
          .on('progress', event => this.sceneEvent(event, chapterID))
      })
    },
    sceneEvent ({ progress, scrollDirection, state }, chapterID) {
      // keep track of last state
      this.current.lastQuote = this.current.quote
      this.current.lastChapter = this.current.chapter
      this.current.chapter = chapterID
      // const chapterData = this.storiesChapters[chapterID]

      // this.current.quote = ~~(progress * (chapterData.stories.length - 1))
      this.scrollState = scrollDirection

      // console.log(this.current.lastQuote, this.current.lastChapter)
      if (this.storiesChapters[this.current.lastChapter]) {
        const lastChapterData = this.storiesChapters[this.current.lastChapter]

        if (lastChapterData.stories[this.current.lastQuote]) {
          lastChapterData.stories[this.current.lastQuote].isActive = false
        }
      }

      this.current.chapter = chapterID
      const chapterData = this.storiesChapters[chapterID]
      this.current.quote = ~~(progress * (chapterData.stories.length - 1))

      chapterData.stories[this.current.quote].isActive = true
    }
  }
}
</script>

<style lang="scss" scoped>
.quotes-container {
  position: relative;
  display: flex;
  justify-content: center;
}
article {
  max-width: 40em;
  margin: auto;
  // margin-bottom: 1em;
}
// .container{
// }
h2 {
  text-align: center;
}
</style>
