import { readFileSync } from 'fs'
import dotenv from 'dotenv'
dotenv.config()

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  router: {
    base: '/10-years-gun-violence/'
  },
  head: {
    title: 'Coming of Age With Gun Violence',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Across ten years of our gun violence reporting, the conversation on school shootings has shifted from “how to stop them” to “how to survive them.” With eaqqch sensational event, we turn our backs on the other forms of gun violence that shape our lives. This is what it sounds like to come of age in the gun violence of America.' },
      { property: 'og:title', content: 'Coming of Age With Gun Violence' },
      { property: 'og:site_name', content: 'Coming of Age With Gun Violence' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://interactive.yr.media/10-years-gun-violence/' },
      { property: 'og:image', content: 'https://s3.amazonaws.com/media.youthradio.org/wp-content/uploads/2019/09/10222753/YR_GunViolence_feature-v2.jpg' },
      { property: 'og:description', content: 'Across ten years of our gun violence reporting, the conversation on school shootings has shifted from “how to stop them” to “how to survive them.” With each sensational event, we turn our backs on the other forms of gun violence that shape our lives. This is what it sounds like to come of age in the gun violence of America.' },
      { property: 'og:image:alt', content: 'Across ten years of our gun violence reporting, the conversation on school shootings has shifted from “how to stop them” to “how to survive them.” With each sensational event, we turn our backs on the other forms of gun violence that shape our lives. This is what it sounds like to come of age in the gun violence of America.' },
      { property: 'fb:app_id', content: '73080818131' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:creator', content: '@itsyrmedia' },
      { name: 'twitter:site', content: '@itsyrmedia' },
      { name: 'twitter:title', content: 'Coming of Age With Gun Violence' },
      { name: 'twitter:description', content: 'Across ten years of our gun violence reporting, the conversation on school shootings has shifted from “how to stop them” to “how to survive them.” With each sensational event, we turn our backs on the other forms of gun violence that shape our lives. This is what it sounds like to come of age in the gun violence of America.' },
      { name: 'twitter:image', content: 'https://s3.amazonaws.com/media.youthradio.org/wp-content/uploads/2019/09/10222753/YR_GunViolence_feature-v2.jpg' },
      { name: 'twitter:image:alt', content: 'Across ten years of our gun violence reporting, the conversation on school shootings has shifted from “how to stop them” to “how to survive them.” With each sensational event, we turn our backs on the other forms of gun violence that shape our lives. This is what it sounds like to come of age in the gun violence of America.' },
      { itemprop: 'name', conten: 'Coming of Age With Gun Violence' },
      { itemprop: 'description', conten: 'Across ten years of our gun violence reporting, the conversation on school shootings has shifted from “how to stop them” to “how to survive them.” With each sensational event, we turn our backs on the other forms of gun violence that shape our lives. This is what it sounds like to come of age in the gun violence of America.' },
      { itemprop: 'image', conten: 'https://s3.amazonaws.com/media.youthradio.org/wp-content/uploads/2019/09/10222753/YR_GunViolence_feature-v2.jpg' }

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
    '~/modules/getdata'
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
