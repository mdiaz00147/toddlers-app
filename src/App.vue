<template>
  <v-app class="disable-zoom">
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style lang="scss">
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

*:not(input, textarea) {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}

body {
  padding-top: constant(safe-area-inset-top);
  /* iOS 11.0 */
  padding-top: env(safe-area-inset-top);
  /* iOS 11.2 */
  // overflow: hidden !important;
  background-color: #121212;
  @media screen and (orientation: landscape) {
    .v-content__wrap {
      padding-left: 44px;
      padding-right: 44px;
    }
  }
}
</style>
