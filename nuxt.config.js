import dotenv from 'dotenv'
import SOCIALDATA from './social.config'
dotenv.config()

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  router: {
    base: SOCIALDATA.baseURL
  },
  head: {
    title: SOCIALDATA.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: SOCIALDATA.description },
      { property: 'og:title', content: SOCIALDATA.title },
      { property: 'og:site_name', content: SOCIALDATA.title },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: SOCIALDATA.url },
      { property: 'og:image', content: SOCIALDATA.featureImage },
      { property: 'og:description', content: SOCIALDATA.description },
      { property: 'og:image:alt', content: SOCIALDATA.description },
      { property: 'fb:app_id', content: SOCIALDATA.fbAppID },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: SOCIALDATA.twitterHandler },
      { name: 'twitter:site', content: SOCIALDATA.twitterHandler },
      { name: 'twitter:title', content: SOCIALDATA.title },
      { name: 'twitter:description', content: SOCIALDATA.description },
      { name: 'twitter:image', content: SOCIALDATA.featureImage },
      { name: 'twitter:image:alt', content: SOCIALDATA.description },
      { itemprop: 'description', content: SOCIALDATA.description },
      { itemprop: 'image', content: SOCIALDATA.featureImage },
      { name: 'msapplication-TileColor', content: '#da532c' },
      { name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      { rel: 'icon', type: 'apple-touch-icon', sizes: '180x180', href: 'favicon/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: 'favicon/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: 'favicon/favicon-16x16.png' },
      { rel: 'shortcut icon', href: 'favicon/favicon-32x32.png' },
      { rel: 'manifest', href: 'favicon/site.webmanifest' },
      { rel: 'mask-icon', color: '#5bbad5', href: 'favicon/safari-pinned-tab.svg' },
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
      src: '~plugins/vue-observable.js',
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
    '~/modules/getdata',
    '@nuxtjs/google-gtag'
  ],
  'google-gtag': {
    id: 'UA-6029148-3',
    config: {
      anonymize_ip: true, // anonymize IP
      page_title: SOCIALDATA.title,
      page_path: SOCIALDATA.baseURL
    },
    debug: false, // enable to track in dev mode
    disableAutoPageTrack: true // disable if you don't want to track each page route with router.afterEach(...).
  },

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
