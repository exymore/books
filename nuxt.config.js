module.exports = {
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    title: "books",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  buildModules: ["@nuxtjs/vuetify"],
  vuetify: {
    treeShake: true
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#3B8070" },
  /*
   ** Build configuration
   */
  build: {
    extractCSS: true,
    transpile: [/^vuetify/],
    extend(config, ctx) {
      if (ctx.isClient) {
        config.devtool = "#source-map";
      }
    }
  },
  renderer: {
    compressor: { threshold: -1 }
  },
  router: {
    prefetchLinks: false
  }
};
