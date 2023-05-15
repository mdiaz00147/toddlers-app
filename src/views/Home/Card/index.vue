<template>
  <v-card :color="colorCurrent" @click.prevent="_changeColor">
    <template v-slot:title> {{ item.title }} </template>
    <!-- <template v-slot:subtitle> {{ item.original_title }} </template> -->
    <template v-slot:text>
      <img
        :src="`https://image.tmdb.org/t/p/w500/${item.poster_path}`"
        alt=""
        class="w-100"
      />
    </template>
  </v-card>
</template>

<script>
export default {
  name: "home-card",
  props: {
    item: {},
  },
  data() {
    return {
      colors: ["#F44336", "#E91E63", "#6A1B9A", "#42A5F5", "#00ACC1", "#E65100"],
      colorCurrent: "",
    };
  },
  methods: {
    _changeColor() {
      const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];

      this.colorCurrent = randomColor;
    },
  },
};
</script>
