<template>
  <div
    ref="container"
    class="container"
  >
    <MenuHeader />

    <div ref="topcontent" class="full-height">
      <header>
        <h2>
          Coming of Age With Gun Violence
        </h2>
      </header>
      <article>
        <p>
          Listening back to ten years of youth stories on gun violence, one major change stands out.
          The conversation on mass shootings has shifted from “how to stop them” to “how to survive them” —
          and that’s sobering. With the U.S. averaging more than one mass shooting per day this year, we’ve come to expect the vigils,
          the “thoughts and prayers” tweets, high school students mourning their classmates and planning escape routes.
        </p>

        <p>
          Another repeated pattern: each time a mass shooting happens, we turn our backs on the
          other forms of gun violence that shape our day-to-day lives. U.S. cities including St. Louis,
          Chicago and Indianapolis are becoming safer and more dangerous at the same time, as gun deaths concentrate in
          specific neighborhoods that are already economically isolated. About one in every 1,000 black men can expect to be killed by
          cops, according to a study from the National Academy of Sciences.
        </p>

        <p>
          When you listen to this decade of youth stories, resist the instinct to simplify. Only when we contend with the
          full mix of these voices can we begin to grasp what it means to come of age in the gun violence of America.
        </p>
      </article>
      <div
        class="mute-bar"
      >
        <div :class="['flex', stuckState? 'fixed': '']">
          <div
            v-if="stuckState"
            ref="progressbar"
            class="progress"
          />
          <span
            v-if="!stuckState"
            class="scroll-text"
          >
            Scroll to hear voices
          </span>
          <UnMuteButton
            :audio-context="audioContext"
            @mutedEvent="mutedEvent"
          />
        </div>
      </div>
    </div>
    <div
      v-for="(chapterRow, chapterID) in storiesChapters"
      :key="`chapter-${chapterID}`"
    >
      <div ref="chapters" :class="['chapter', `back-chapter-${chapterID}`]">
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

    <div class="full-height">
      <header>
        <h3>
          The Stories
        </h3>
      </header>
      <article>
        <ul>
          <li
            v-for="story in allStories"
            :key="story"
          >
            <a :href="story.Source">
              {{ story.Title }}, {{ story.Year }}
            </a>
          </li>
        </ul>
        <header>
          <h3>
            Credits
          </h3>
        </header>
      </article>
    </div>
  </div>
</template>

<script>

import { csvParse } from 'd3-dsv'
import { group } from 'd3-array'
import { Howler } from 'howler'
import CommonUtils from '../mixins/CommonUtils'
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
  mixins: [
    CommonUtils
  ],
  data () {
    return {
      current: {
        chapter: -1,
        quote: -1
      },
      scrollState: null,
      controller: null,
      scenes: [],
      audioContext: null,
      stuckState: false
    }
  },
  computed: {
    allStories () {
      return this.storiesChapters
        .map(e => e.stories)
        .flat()
        .sort((a, b) => a.Year - b.Year)
    },
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
      this.stuckState = entry.intersectionRatio <= 0
    }, {
      threshold: 0
    })
    muteObserver.observe(this.$refs.topcontent)
    window.addEventListener('scroll', event => this.debouceEvent(event, this.onScroll), false)
  },
  methods: {
    onScroll () {
      const p = window.scrollY / (document.querySelector('html').getBoundingClientRect().height - window.innerHeight)
      if (this.stuckState) {
        this.$refs.progressbar.style.width = `${p * 100}%`
      }
    },
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
          .on('progress', event => this.sceneEvent(event, chapterID, chapterRef))
      })
    },
    sceneEvent ({ progress, scrollDirection, state }, chapterID, chapterRef) {
      let newprog = progress / 0.7
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
      if (progress <= 0.7) {
        chapterRef.style.opacity = '1'
        this.current.chapter = chapterID
        const chapterData = this.storiesChapters[chapterID]
        this.current.quote = ~~(newprog * (chapterData.stories.length - 1))
        chapterData.stories[this.current.quote].isActive = true
      }
      if (progress >= 1) {
        chapterRef.style.opacity = '0'
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
  background-image: url('~assets/images/mass-shootings.jpg');
  background-repeat: no-repeat;
  background-size: cover;

}
.back-chapter-1 {
  // background-color: #333333;
    // background-color: #131313 ;
  background-image: url('~assets/images/police-violence.jpg');
    background-repeat: no-repeat;
  background-size: cover;

}
.back-chapter-2 {
  // background-color: #3F3F3F;
   background-image: url('~assets/images/community-violence.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}
.quotes-container {
  position: relative;
  display: flex;
  justify-content: center;
  // height: 90vh;
  // align-items: center;
}
.mute-bar {
  position: relative;
  right: 0px;
  top: 0px;
  z-index: 10;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.scroll-text{
  margin-right: 1rem;
  font-size: 1rem;
  font-weight: 800;
  text-transform: uppercase;
}
.flex{
  display: flex;
  width: 100%;
    justify-content: center;

}
.fixed {
  position: fixed;
    justify-content: flex-end;

  right: 0px;
  top: 0px
}
.chapter {
  position: relative;
  height: 100vh;
  transition: opacity 0.3s ease-out;
}
h2,h3 {
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
  top: 0;
  height: 10px;
  background-color: lighten($color: $dark, $amount: 20%);
  width: 0%;
  z-index: -1;
}
.center {
  text-align: center;
}
.full-height{
  display: flex;
  flex-direction:column;
  justify-content: space-around;
  height: calc(100vh - 68px);
}
ul{
  list-style-type: none;
}
</style>
