<template>
  <div>
    <button @click="unMute">
      {{ (audioContextState? audioContextState : 'loading') }}  {{ ( muteState? 'MUTED' : 'NOT MUTED') }}
    </button>
  </div>
</template>

<script>
// based on https://github.com/Tonejs/unmute/
const SILENT_AUDIO = 'data:audio/mp3;base64,//MkxAAHiAICWABElBeKPL/RANb2w+yiT1g/gTok//lP/W/l3h8QO/OCdCqCW2Cw//MkxAQHkAIWUAhEmAQXWUOFW2dxPu//9mr60ElY5sseQ+xxesmHKtZr7bsqqX2L//MkxAgFwAYiQAhEAC2hq22d3///9FTV6tA36JdgBJoOGgc+7qvqej5Zu7/7uI9l//MkxBQHAAYi8AhEAO193vt9KGOq+6qcT7hhfN5FTInmwk8RkqKImTM55pRQHQSq//MkxBsGkgoIAABHhTACIJLf99nVI///yuW1uBqWfEu7CgNPWGpUadBmZ////4sL//MkxCMHMAH9iABEmAsKioqKigsLCwtVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVV//MkxCkECAUYCAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
export default {
  props: {
    audioContextProp: {
      type: Object,
      require: false,
      default: null
    }
  },
  data () {
    return {
      muteState: true,
      silentPlayer: null,
      audioContextState: null,
      audioContext: null
    }
  },
  mounted () {
    this.silentPlayer = document.createElement('audio')
    this.silentPlayer.src = SILENT_AUDIO
    this.silentPlayer.controls = false
    this.silentPlayer.preload = 'auto'
    this.silentPlayer.loop = false
    this.silentPlayer.title = 'Web Audio'

    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (this.audioContextProp) {
      this.audioContext = this.audioContextProp
    } else {
      this.audioContext = new AudioContext()
    }
    this.audioContextState = this.audioContext.state
    this.audioContext.addEventListener('statechange', async () => (this.audioContextState = await this.audioContext.state))
  },
  methods: {
    unMute () {
      if (this.audioContextState !== 'running') {
        this.audioContext.resume()
        this.silentPlayer.play()
        this.muteState = false
      } else {
        this.muteState = !this.muteState
        this.$emit('mutedEvent', this.muteState)
      }
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
.duplicated {
  position: absolute;
  filter: blur(5px);
  top: 0px;
  left: 0px;
}
.fade {
  transition: transform, opacity;
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
