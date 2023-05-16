<template>
  <v-card :color="colorCurrent" @click.prevent="_changeColor">
    <template v-slot:title> {{ item.title }} </template>
    <!-- <template v-slot:title> {{ item.id }} - {{ countTouches }} </template> -->
    <!-- <template v-slot:subtitle> {{ item.original_title }} </template> -->
    <template v-slot:default>
      <!-- {{ $store.getters.getLoading }} -->
      <img
        :src="`https://image.tmdb.org/t/p/w500/${item.poster_path}`"
        alt=""
        class="w-100"
      />
    </template>
  </v-card>
</template>

<script lang="ts">
export default {
  name: "home-card",
  props: {
    item: {
      type: Object as any,
    },
  },
  data() {
    return {
      countTouches: 0,
      colors: [
        "#F44336",
        "#E91E63",
        "#6A1B9A",
        "#42A5F5",
        "#00ACC1",
        "#E65100",
        "#C0CA33",
        "#33691E",
        "#F9A825",
        "#E64A19",
        "#FAFAFA",
        "#FFEE58",
        "#76FF03",
        "#00E676",
        "#81D4FA",
        "#FF4081",
        "#90CAF9",
      ],
      colorCurrent: "",
    };
  },
  watch: {
    countTouches: function (newValue) {
      console.log("newValue", newValue, this.item.id);
      // console.log('two', newValue % 2);
      // console.log('three', newValue % 3);
      const isMultipleOfTwo = newValue % 2 === 0;
      const isMultipleOfThree = newValue % 3 === 0;
      console.log("isMultipleOfTwo", isMultipleOfTwo);
      console.log("isMultipleOfThree", isMultipleOfThree);

      if (isMultipleOfTwo || isMultipleOfThree) {
        if (isMultipleOfTwo) {
          this.$store.commit("addItemsTouchedTwoTimes", this.item.id);
          this.$store.commit("deleteItemsTouchedThreeTimes", this.item.id);
        }

        if (isMultipleOfThree) {
          this.$store.commit("addItemsTouchedThreeTimes", this.item.id);
          this.$store.commit("deleteItemsTouchedTwoTimes", this.item.id);
        }
      } else {
        console.log("remove", this.item.id);
        this.$store.commit("deleteItemsTouchedTwoTimes", this.item.id);
        this.$store.commit("deleteItemsTouchedThreeTimes", this.item.id);
      }
    },
  },
  methods: {
    _changeColor() {
      const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];

      this.colorCurrent = randomColor;
      this.countTouches += 1;
    },
  },
};
</script>
