<template>
  <div
    class="quote-container"
    :style=" randomPos "
  >
    <diV
      class="blur"
      :style="blurStyle"
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
      isSoundPlaying: false
    }
  },
  computed: {
    isActive () {
      return this.quoteData.isActive
    },
    randomPos () {
      return {
        marginTop: `${Math.random() * 150}px`,
        marginLeft: `${(Math.random() - 0.5) * 2 * 50}px`
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
    blurStyle () {
      if (!this.isSoundPlaying) {
        return {
          // filter: 'blur(30px)',
          transform: 'scale(1)',
          opacity: '0.1'
        }
      }
      return {
        // filter: 'unset',
        transform: 'scale(1.2)',
        opacity: '0.99'
      }
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
  created () {
    this.sound = new Howl({
      autoplay: false,
      volume: 0.1,
      // preload: false,
      loop: false,
      src: [`audios/${this.quoteData.File_Name}`]
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

.blur {
  transition: transform, opacity;
  transition-duration: 1s;
  transition-timing-function: ease-in-out;
}

blockquote {
  font-weight: 700;
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
