<template>
  <div class="quote-container" :style=" randomPos ">
    <diV class="blur" :style="blurStyle">
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
    },
    isActive: {
      type: Boolean,
      default: false,
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
    randomPos () {
      return {
        marginTop: `${Math.random() * 0}px`,
        marginLeft: `${Math.random() * 300}px`,
        marginRight: `${Math.random() * 300}px`
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
          filter: 'blur(15px)'
        }
      }
      return {
        filter: 'unset'
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
      autoplay: true,
      volume: 0.1,
      loop: false,
      src: [this.quoteData.Audio_Source],
      sprite: {
        quote: [this.startTime * 1000, this.durationTime * 1000]
      }
    })
    this.sound.once('load', this.soundLoad)
    this.sound.once('play', this.soundPlayed)
    this.sound.once('end', this.soundPaused)
    this.sound.once('pause', this.soundPaused)
  },
  methods: {
    soundLoaded () {
      // eslint-disable-next-line no-console
      console.log(this.quoteData.title, 'LOADED')
    },
    playSound () {
      if (this.sound.state() === 'loaded' && !this.isSoundPlaying) {
        this.isSoundPlaying = true
        this.soundID = this.sound.play('quote')
      }
    },
    pauseSound () {
      this.sound.pause()
      this.isSoundPlaying = false
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

.quote-container{
  // float:right;
  user-select: none;
}

.blur{
  transition: filter 0.5s;
}

blockquote {

  &:before {
    content: '\201C';
    font-size: 1.5rem;
    /* margin-right: 4px; */
    /* margin-left: -8px; */
  }

  &:after {
    content: '\201D';
    font-size: 1.5rem;
    /* margin-left: 4px; */
    /* margin-right: -8px; */
  }
}
</style>>
