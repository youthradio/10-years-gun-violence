<template>
  <div class="container">
    <article>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet porttitor risus. Ut sit amet diam facilisis, posuere urna eget, lobortis justo. Sed blandit, nisi rhoncus semper dapibus, nibh est laoreet neque, in porta diam dolor in risus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas arcu augue, viverra vitae varius vel, pulvinar et sapien. Pellentesque in molestie ex. Donec semper ullamcorper elit, et mattis ex pulvinar et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a massa diam. Curabitur scelerisque vestibulum sapien eget placerat. Nunc consectetur, eros quis tincidunt placerat, leo tortor porta urna, ut tempor quam lectus sit amet dolor. Integer arcu odio, aliquet nec magna et, hendrerit hendrerit sem.
      </p>
    </article>
    <div class="mute-button">
      <UnMuteButton
        :audio-context="audioContext"
        @mutedEvent="mutedEvent"
      />
    </div>
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
import { Howler } from 'howler'
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
        chapter: -1,
        quote: -1
      },
      scrollState: null,
      controller: null,
      scenes: [],
      audioContext: null
    }
  },
  computed: {
    totalStories () {
      return this.storiesChapters.reduce((acc, e) => acc + e.length, 0)
    },
    totalChapters () {
      return this.storiesChapters.length
    },
    globalMutedState () {
      return Howler._muted
    }
  },
  watched: {
    globalMutedState () {
      console.log(this.globalMutedState)
    }
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
    Howler.autoUnlock = true
    Howler.volume(0.5)
    window.addEventListener('resize', this.setParentsHeight)
    this.audioContext = Howler.ctx
    this.controller = new this.$ScrollMagic.Controller()
    this.setParentsHeight()
    this.createScenes()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.setParentsHeight)
  },
  methods: {
    mutedEvent (state) {
      Howler.mute(state)
      // this.$Howler._muted
    },
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
        const maxheight = Math.max(...Array.from(container.children).map(e => e.getBoundingClientRect().height + e.getBoundingClientRect().y - containerY))
        container.style.height = `${maxheight}px`
      })
    },
    createScenes () {
      this.$refs.chapters.forEach((chapterRef, chapterID) => {
        const elHeight = chapterRef.getBoundingClientRect().height
        const scene = new this.$ScrollMagic.Scene({
          // triggerHook: 'onEnter',
          offset: elHeight,
          duration: 3000
        })
        scene.triggerElement(chapterRef)
          .setPin(chapterRef)
          .addTo(this.controller)
          .on('progress', event => this.sceneEvent(event, chapterID))
      })
    },
    sceneEvent ({ progress, scrollDirection, state }, chapterID) {
      let newprog = (progress - 0.2) / (0.8 - 0.2) * (1 - 0) + 0
      newprog = Math.max(Math.min(newprog, 1), 0)
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
      if (progress >= 0.2 && progress <= 0.8) {
        this.current.chapter = chapterID
        const chapterData = this.storiesChapters[chapterID]
        this.current.quote = ~~(newprog * (chapterData.stories.length - 1))

        chapterData.stories[this.current.quote].isActive = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.quotes-container {
  position: relative;
  display: flex;
  justify-content: center;
  // align-items: center;
}
.mute-button {
  display: flex;
  justify-content: flex-end;
  position: sticky;
  right: 0px;
  top: 0px;
  z-index: 1000;
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
