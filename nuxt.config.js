import { readFileSync } from 'fs'
import dotenv from 'dotenv'
dotenv.config()

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  router: {
    base: '/gun-violence-arx/'
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { property: 'og:title', content: 'Coming of Age With Gun Violence' },
      { property: 'og:site_name', content: 'Coming of Age With Gun Violence' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://yr.media/intheirownwords/' },
      { property: 'og:image', content: 'https://yr.media/intheirownwords/socialimg.png' },
      { property: 'og:description', content: 'An interactive exploration of non-binary gender identity created by non-binary teens and young adults at Youth Radio.' },
      { property: 'og:image:alt', content: 'An interactive exploration of non-binary gender identity created by non-binary teens and young adults at Youth Radio.' },
      { property: 'fb:app_id', content: '73080818131' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:creator', content: 'summary' },
      { name: 'twitter:site', content: '@itsyrmedia' },
      { name: 'twitter:title', content: 'Coming of Age With Gun Violence' },
      { name: 'twitter:description', content: 'An interactive exploration of non-binary gender identity created by non-binary teens and young adults at Youth Radio.' },
      { name: 'twitter:image', content: 'https://yr.media/intheirownwords/socialimg.png' },
      { name: 'twitter:image:alt', content: 'Nuxt.js logo' },
      { itemprop: 'name', conten: 'Coming of Age With Gun Violence' },
      { itemprop: 'description', conten: '' },
      { itemprop: 'image', conten: 'https://yr.media/intheirownwords/socialimg.png' }

    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://yr.media/statics/yr-media-typography/yr-typography.css' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {
      src: '~plugins/scrollmagic.js',
      ssr: false
    },
    {
      src: '~plugins/ga.js',
      ssr: false
    }

  ],
  /*
  ** Nuxt.js dev-modules
  */
  devModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
  // server: {
  //   https: {
  //     key: readFileSync(`${process.env.SSLKEY}`),
  //     cert: readFileSync(`${process.env.SSLCRT}`)
  //   }
  // }
}
