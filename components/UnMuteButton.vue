<template>
  <div>
    <button class="bt-box" @click="unMute">
      <span class="mute-text">{{ ( muteState? 'TURN SOUND ON' : 'MUTE') }}</span>
      <svg
        v-if="!muteState"
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="volume-up"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        class="p-button"
      ><path fill="currentColor" d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zm233.32-51.08c-11.17-7.33-26.18-4.24-33.51 6.95-7.34 11.17-4.22 26.18 6.95 33.51 66.27 43.49 105.82 116.6 105.82 195.58 0 78.98-39.55 152.09-105.82 195.58-11.17 7.32-14.29 22.34-6.95 33.5 7.04 10.71 21.93 14.56 33.51 6.95C528.27 439.58 576 351.33 576 256S528.27 72.43 448.35 19.97zM480 256c0-63.53-32.06-121.94-85.77-156.24-11.19-7.14-26.03-3.82-33.12 7.46s-3.78 26.21 7.41 33.36C408.27 165.97 432 209.11 432 256s-23.73 90.03-63.48 115.42c-11.19 7.14-14.5 22.07-7.41 33.36 6.51 10.36 21.12 15.14 33.12 7.46C447.94 377.94 480 319.54 480 256zm-141.77-76.87c-11.58-6.33-26.19-2.16-32.61 9.45-6.39 11.61-2.16 26.2 9.45 32.61C327.98 228.28 336 241.63 336 256c0 14.38-8.02 27.72-20.92 34.81-11.61 6.41-15.84 21-9.45 32.61 6.43 11.66 21.05 15.8 32.61 9.45 28.23-15.55 45.77-45 45.77-76.88s-17.54-61.32-45.78-76.86z" class="" /></svg>
      <svg
        v-else
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="volume-mute"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        class="p-button"
      ><path fill="currentColor" d="M215.03 71.05L126.06 160H24c-13.26 0-24 10.74-24 24v144c0 13.25 10.74 24 24 24h102.06l88.97 88.95c15.03 15.03 40.97 4.47 40.97-16.97V88.02c0-21.46-25.96-31.98-40.97-16.97zM461.64 256l45.64-45.64c6.3-6.3 6.3-16.52 0-22.82l-22.82-22.82c-6.3-6.3-16.52-6.3-22.82 0L416 210.36l-45.64-45.64c-6.3-6.3-16.52-6.3-22.82 0l-22.82 22.82c-6.3 6.3-6.3 16.52 0 22.82L370.36 256l-45.63 45.63c-6.3 6.3-6.3 16.52 0 22.82l22.82 22.82c6.3 6.3 16.52 6.3 22.82 0L416 301.64l45.64 45.64c6.3 6.3 16.52 6.3 22.82 0l22.82-22.82c6.3-6.3 6.3-16.52 0-22.82L461.64 256z" class="" /></svg>
    </button>
  </div>
</template>

<script>
// based on https://github.com/Tonejs/unmute/
const SILENT_AUDIO = 'data:audio/mp3;base64,//MkxAAHiAICWABElBeKPL/RANb2w+yiT1g/gTok//lP/W/l3h8QO/OCdCqCW2Cw//MkxAQHkAIWUAhEmAQXWUOFW2dxPu//9mr60ElY5sseQ+xxesmHKtZr7bsqqX2L//MkxAgFwAYiQAhEAC2hq22d3///9FTV6tA36JdgBJoOGgc+7qvqej5Zu7/7uI9l//MkxBQHAAYi8AhEAO193vt9KGOq+6qcT7hhfN5FTInmwk8RkqKImTM55pRQHQSq//MkxBsGkgoIAABHhTACIJLf99nVI///yuW1uBqWfEu7CgNPWGpUadBmZ////4sL//MkxCMHMAH9iABEmAsKioqKigsLCwtVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVV//MkxCkECAUYCAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV'
export default {
  props: {
    audioContext: {
      require: false,
      default: null,
      validator (value) {
        return value instanceof AudioContext
      }
    }
  },
  data () {
    return {
      muteState: true,
      silentPlayer: null,
      audioContextState: null
    }
  },
  watch: {
    audioContext () {
      this.audioContextState = this.audioContext.state
      this.muteState = this.audioContextState !== 'running'
      this.audioContext.addEventListener('statechange', async () => (this.audioContextState = await this.audioContext.state))
    }
  },
  mounted () {
    this.silentPlayer = document.createElement('audio')
    this.silentPlayer.src = SILENT_AUDIO
    this.silentPlayer.controls = false
    this.silentPlayer.preload = 'auto'
    this.silentPlayer.loop = false
    this.silentPlayer.title = 'Web Audio'
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
@import '~@/css/vars';

.p-button {
  width: 100%;
  max-width: 1rem;
  height: auto;
}
.mute-text{
  margin-right: 1rem;
  font-size: 1rem;
  font-weight: 800;
}
.bt-box{
  display: flex;
  justify-content: space-around;
  align-items: center;
  border: 0;
  background-color: lighten($color: $dark, $amount: 20%);
  border-radius: 1px;
  cursor: pointer;
}
</style>>
