require('dotenv').config();
module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'books',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  buildModules: ['@nuxtjs/vuetify'],
  modules: ['@nuxtjs/dotenv'],
  vuetify: {
    treeShake: true,
  },
  plugins: ['@/plugins/contentful'],
  env: {
    CTF_CDA_ACCESS_TOKEN: process.env.CTF_CDA_ACCESS_TOKEN,
    CTF_SPACE_ID: process.env.CTF_SPACE_ID,
    CTF_ENVIRONMENT_ID: process.env.CTF_ENVIRONMENT_ID,
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: '#3B8070' },
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    transpile: [/^vuetify/],
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
      if (ctx.isClient) {
        config.devtool = '#source-map';
      }
    },
  },
  renderer: {
    compressor: { threshold: -1 },
  },
  router: {
    prefetchLinks: false,
  },
};
