<template>
  <div
    ref="container"
    class="container"
  >
    <MenuHeader />
    <header>
      <h2>
        Coming of Age With Gun Violence
      </h2>
    </header>
    <article>
      <p>
        Listening back to ten years of youth stories on gun violence, one major change stands out.
        The conversation on mass shootings has shifted from “how to stop them” to “how to survive them” — and that’s sobering.
        With the U.S. now averaging more than <a target="_blank" href="https://www.gunviolencearchive.org/">one mass shooting per day</a>, we now expect the vigils, the “thoughts and prayers” tweets,
        high school students mourning their classmates and planning escape routes.
      </p>
      <p>
        Another repeated pattern: each time a mass shooting happens, we turn our backs on the other forms of gun violence that shape our day-to-day lives.
        [Line + stat on street violence in urban areas]. [Line + stat on police killings of black and brown young people who are unarmed].
      </p>
      <p>
        When you listen to this decade of youth stories, resist the instinct to simplify.
        Only when we contend with the full mix of these voices can we begin to grasp what it means to come of age in the gun violence of America.
      </p>
    </article>
    <article class="center">
      <p>
        Audio commentaries auto-play as you scroll down
      </p>
    </article>
    <div
      ref="mutecontainer"
      class="mute-button"
    >
      <div
        ref="topsentinel"
        class="sticky_sentinel--top"
      />
      <div
        ref="progressbar"
        class="progress"
      />
      <UnMuteButton
        :audio-context="audioContext"
        @mutedEvent="mutedEvent"
      />
    </div>
    <div
      v-for="(chapterRow, chapterID) in storiesChapters"
      :key="`chapter-${chapterID}`"
      ref="chapters"
      :class="['chapter', `back-chapter-${chapterID}`]"
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
import MenuHeader from '~/components/MenuHeader.vue'

const DURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaEu4kTlAHyqAV-vIHBHIgOoJtoSzHYDZlvbs6ryP4w1YQTJDDWYGULgecXp9O-JP9fAbm3NqzgJV_/pub?output=csv'
export default {
  components: {
    QuotePlayer,
    UnMuteButton,
    MenuHeader
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
    Howler.autoUnlock = true
    Howler.volume(0.5)
    this.audioContext = Howler.ctx
    this.controller = new this.$ScrollMagic.Controller()
    this.$nextTick(() => {
      this.createScenes()
    })
    const muteObserver = new IntersectionObserver((entries, observer) => {
      const entry = entries.pop()
      // this.$refs.topsentinel.backgroundColor = `hsl(0, 100%, ${entry.intersectionRatio * 100}%)`
      // this.$refs.topsentinel.textContent = `${(entry.intersectionRatio * 100).toFixed(0)}% visible`
      this.$refs.mutecontainer.classList.toggle('flex-end', entry.intersectionRatio <= 0)
      this.$refs.progressbar.classList.toggle('visibility', entry.intersectionRatio <= 0)
    }, {
      threshold: Array.from({ length: 51 }, (d, i) => i / 50)
    })
    muteObserver.observe(this.$refs.topsentinel)

    let timeout
    window.addEventListener('scroll', (event) => {
      if (timeout) {
        window.cancelAnimationFrame(timeout)
      }
      timeout = window.requestAnimationFrame(() => {
        const p = window.scrollY / (document.querySelector('html').getBoundingClientRect().height - window.innerHeight)
        this.$refs.progressbar.style.width = `${p * 100}%`
      })
    }, false)
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
    createScenes () {
      this.$refs.chapters.forEach((chapterRef, chapterID) => {
        // const elHeight = chapterRef.getBoundingClientRect().height
        const scene = new this.$ScrollMagic.Scene({
          triggerHook: 'onLeave',
          duration: '300%'
        })
        scene.triggerElement(chapterRef)
          .setPin(chapterRef)
          .addTo(this.controller)
          .on('progress', event => this.sceneEvent(event, chapterID))
      })
    },
    sceneEvent ({ progress, scrollDirection, state }, chapterID) {
      let newprog = (progress - 0.00) / (0.8 - 0.00)
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
      if (progress >= 0.05 && progress <= 0.8) {
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
@import "~@/css/vars";
@import "~@/css/base";

.back-chapter-0 {
  // background-color: #131313 ;
}
.back-chapter-1 {
  // background-color: #333333;
}
.back-chapter-2 {
  // background-color: #3F3F3F;
}
.quotes-container {
  position: relative;
  display: flex;
  justify-content: center;
  height: 90vh;
  // align-items: center;
}
.mute-button {
  display: flex;
  justify-content: center;
  position: sticky;
  right: 0px;
  top: 0px;
  z-index: 10;
}
.flex-end {
  justify-content: flex-end;
}
article {
  max-width: 40em;
  margin: auto;
  // margin-bottom: 1em;
}
.chapter {
  position: relative;
  height: 100vh;
}
h2 {
  text-align: center;
  margin-top: 0;
  padding-top: 3rem;
  margin-bottom: 3rem;
}
.sticky_sentinel--top {
  position: absolute;
  left: 0;
  right: 0;
  background-color: red;
  visibility: hidden;
  height: 40px;
  bottom: 100%;
}
.progress {
  position: absolute;
  left: 0;
  right: 0;
  height: 10px;
  background-color: lighten($color: $dark, $amount: 20%);
  width: 0%;
  z-index: -1;
  visibility: hidden;
}
.visibility {
  visibility: visible;
}
.center {
  text-align: center;
}
</style>
