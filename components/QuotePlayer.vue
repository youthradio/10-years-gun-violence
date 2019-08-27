<template>
  <div
    class="quote-container"
    :style=" randomPos "
  >
    <div
      class="fade"
      :style="fadeStyle"
    >
      <blockquote>
        {{ quoteData.Quote }}
      </blockquote>
      <h5>
        {{ quoteData.Title }} {{ quoteData.Year }}
      </h5>
    </div>
  </div>
</template>

<script>
import { Howl } from 'howler'

export default {
  props: {
    quoteData: {
      type: Object,
      defaul: null,
      required: true
    }
  },
  data () {
    return {
      sound: null,
      soundID: null,
      isSoundPlaying: false,
      screenHeight: 0,
      screenWidth: 0
    }
  },
  computed: {
    isActive () {
      return this.quoteData.isActive
    },
    randomPos () {
      return {
        marginTop: `${Math.random() * this.screenHeight * 0.20}px`,
        marginLeft: `${(Math.random() - 0.5) * 2 * this.screenWidth * 0.1}px`
      }
    },
    startTime () {
      const time = this.quoteData.Start.split(':')
      return (+time[1] * 60 + +time[2])
    },
    durationTime () {
      const time = this.quoteData.End.split(':')
      return (+time[1] * 60 + +time[2]) - this.startTime
    },
    fadeStyle () {
      if (!this.isSoundPlaying) {
        return {
          opacity: '0.05'
        }
      }
      return {
        transform: 'scale(1.1)',
        opacity: '0.99',
        textShadow: '0px 0px 20px white'
      }
    },
    fileName () {
      // return only file name
      return this.quoteData.File_Name.split('.')[0]
    }
  },
  watch: {
    isActive () {
      if (this.isActive) {
        this.playSound()
      } else {
        this.pauseSound()
      }
    }
  },
  mounted () {
    this.screenHeight = window.screen.height
    this.screenWidth = window.screen.width
  },
  created () {
    // eslint-disable-next-line no-undef
    this.sound = new Howl({
      autoplay: false,
      volume: 1.0,
      // preload: false,
      loop: false,
      src: [`audios/${this.fileName}.webm`, `audios/${this.fileName}.mp3`]
      // sprite: {
      //   quote: [this.startTime * 1000, this.durationTime * 1000]
      // }
    })
    this.sound.once('load', this.soundLoad)
    this.sound.once('play', this.soundPlayed)
    this.sound.once('end', this.soundPaused)
    this.sound.once('pause', this.soundPaused)
  },
  beforeDestroy () {
    this.sound.unload()
  },
  methods: {
    soundLoaded () {
      // eslint-disable-next-line no-console
      console.log(this.quoteData.title, 'LOADED')
    },
    playSound () {
      // this.sound.load()
      if (this.sound.state() === 'loaded' && !this.isSoundPlaying) {
        this.isSoundPlaying = true
        this.soundID = this.sound.play()
      }
    },
    pauseSound () {
      // this.sound.pause()
      this.sound.stop()
      this.isSoundPlaying = false
      this.quoteData.isActive = false
    },
    soundPlayed () {
    },
    soundPaused () {
      this.isSoundPlaying = false
    }
  }
}
</script>

<style lang="scss" scoped>
.quote-container {
  // float:right;
  position: absolute;
  user-select: none;
  max-width: 32em;
}
.fade {
  transition: transform, opacity, text-shadow;
  transition-duration: 1s;
  transition-timing-function: ease-in-out;
}
blockquote {
  font-weight: 700;
  margin: 0px;

  &:before {
    content: "\201C";
    font-size: 1.5rem;
    /* margin-right: 4px; */
    /* margin-left: -8px; */
  }

  &:after {
    content: "\201D";
    font-size: 1.5rem;
    /* margin-left: 4px; */
    /* margin-right: -8px; */
  }
}
</style>>
