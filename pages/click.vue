<template>
  <div class="container">
    <article>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet porttitor risus. Ut sit amet diam facilisis, posuere urna eget, lobortis justo. Sed blandit, nisi rhoncus semper dapibus, nibh est laoreet neque, in porta diam dolor in risus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas arcu augue, viverra vitae varius vel, pulvinar et sapien. Pellentesque in molestie ex. Donec semper ullamcorper elit, et mattis ex pulvinar et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a massa diam. Curabitur scelerisque vestibulum sapien eget placerat. Nunc consectetur, eros quis tincidunt placerat, leo tortor porta urna, ut tempor quam lectus sit amet dolor. Integer arcu odio, aliquet nec magna et, hendrerit hendrerit sem.
      </p>
    </article>
    <article class="center">
      <p>
        Click or Tap to play Audio commentaries
      </p>
    </article>
    <div ref="mutecontainer" class="mute-button">
      <div ref="topsentinel" class="sticky_sentinel--top" />
      <UnMuteButton
        :audio-context="audioContext"
        @mutedEvent="mutedEvent"
      />
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
      <div class="click-area">
        <div class="relative" @click="playNext(-1, chapterID)" />
        <div class="relative" @click="playNext(+1, chapterID)">
          <span v-if="lastChapter === -1" class="click-anima" />
        </div>
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
      current: {},
      lastChapter: -1,
      controller: null,
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
    const muteObserver = new IntersectionObserver((entries, observer) => {
      const entry = entries.pop()
      // this.$refs.topsentinel.backgroundColor = `hsl(0, 100%, ${entry.intersectionRatio * 100}%)`
      // this.$refs.topsentinel.textContent = `${(entry.intersectionRatio * 100).toFixed(0)}% visible`
      this.$refs.mutecontainer.classList.toggle('flex-end', entry.intersectionRatio <= 0)
    }, {
      threshold: Array.from({ length: 51 }, (d, i) => i / 50)
    })
    muteObserver.observe(this.$refs.topsentinel)
  },
  methods: {
    mutedEvent (state) {
      Howler.mute(state)
      // this.$Howler._muted
    },
    playNext (dir, chapterID) {
      if (!this.current.hasOwnProperty(chapterID)) {
        this.current[chapterID] = 0
      }
      // console.log(dir, chapterID)
      const quotesLenght = this.storiesChapters[chapterID].length - 1
      if (this.storiesChapters[this.lastChapter]) {
        this.storiesChapters[this.lastChapter].stories[this.current[this.lastChapter]].isActive = false
      }
      if (dir > 0) {
        this.current[chapterID]++
        this.current[chapterID] = this.current[chapterID] > quotesLenght ? 0 : this.current[chapterID]
      } else {
        this.current[chapterID]--
        this.current[chapterID] = this.current[chapterID] < 0 ? quotesLenght : this.current[chapterID]
      }
      this.storiesChapters[chapterID].stories[this.current[chapterID]].isActive = true
      this.lastChapter = chapterID
    },
    getQuoteIndex (chapterID, ind) {
      return ind + (chapterID > 0 ? this.storiesChapters[chapterID - 1].length : 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.mute-button{
  display: flex;
  justify-content: center;
  position: sticky;
  right: 0px;
  top: 0px;
  z-index: 1000;
}
.quotes-container{
  position: relative;
  display: flex;
  justify-content: center;
  // align-items: center;
  height: 100%;
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
.chapter{
  position: relative;
  height: 100vh;
}
.click-area{
  position: absolute;
  z-index: 2000;
  display: flex;
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
  > div{
    height: 100%;
    width: 100%;
    margin-left: 2em;
    margin-right: 2em;
  }
}
.relative {
  position: relative;
}
.click-anima {
  z-index: -100;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  // margin: 100px auto;
  // background-color: #333;
  background-color: #fff;
  border-radius: 100%;
  animation: scaleout 1s infinite ease-in-out;
}
@keyframes scaleout {
  0% {
    transform: translate(-20px, -20px) scale(0);
  }
  100% {
    transform: translate(-20px, -20px) scale(1.2);
    opacity: 0.2;
  }
}
.sticky_sentinel--top{
  position: absolute;
  left: 0;
  right: 0;
  background-color: red;
  visibility: hidden;
  height: 40px;
  bottom: 100%;
}
.flex-end {
  justify-content: flex-end;
}
.center{
  text-align: center;
}
</style>
