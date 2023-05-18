const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '',
  pluginOptions: {
    cordovaPath: 'src-cordova'
  },
  pwa: {
    name: "ToddlersApp  ",
    themeColor: "#344675",
    msTileColor: "#344675",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#344675",

    workboxOptions: {
      /* 
        this option prevents dist/index.html from being cached 
        on the browser and, therefore, have outdated versions 
        of the app since index.html will point to app.HASH.js, 
        and if it's cached, it won't update new versions of 
        the HTML file where the new HASH version is updated.
      */
      exclude: [
        /\.html$/,   // I don't know why I need to change this matching pattern from string to RegEx to get it work.
        '/statics/ionicons-cheatsheet/',
      ],
      skipWaiting: true,
    }
  },
})
