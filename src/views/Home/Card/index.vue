<template>
  <v-card :color="colorCurrent" @click.prevent="_changeColor" :ref="item.id">
    <template v-slot:title> {{ item.title }} </template>
    <!-- <template v-slot:title> {{ item.id }} - {{ countTouches }} </template> -->
    <template v-slot:subtitle>
      <button id="button" ref="button" @click.stop="_playVideo()">{{ item.id }}</button>
    </template>
    <template v-slot:default>
      <!-- {{ $store.getters.getLoading }} -->
      <img
        :src="`https://image.tmdb.org/t/p/w500/${item.poster_path}`"
        alt=""
        class="w-100"
        v-if="!videoPlay"
      />

      <template v-if="videoPlay">
        <!-- <YoutubeVue3
          ref="youtube"
          :videoid="videoId"
          :width="('100%' as any)"
          :height="videoPlayerHeight"
          :autoplay="1"
        /> -->

        <div ref="plyrContainer" @click.stop="_playVideo()">
          <video ref="video"></video>
        </div>
      </template>
    </template>
  </v-card>
</template>

<script lang="ts">
import { YoutubeVue3 } from "youtube-vue3";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

export default {
  name: "home-card",
  props: {
    item: {
      type: Object as any,
    },
  },
  data() {
    const plyrInstance: any = null;

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
        "#00E676",
        "#81D4FA",
        "#FF4081",
        "#90CAF9",
      ],
      colorCurrent: "",
      playerVars: {
        autoplay: 1,
      },
      videoPlay: false,
      videoId: "",
      videoPlayerHeight: 0,
      plyrInstance,
    };
  },
  watch: {
    countTouches: function (newValue) {
      const isMultipleOfTwo = newValue % 2 === 0;
      const isMultipleOfThree = newValue % 3 === 0;

      if (isMultipleOfTwo || isMultipleOfThree) {
        if (isMultipleOfTwo) {
          this.$store.commit("addItemsTouchedTwoTimes", this.item.id);
          this.$store.commit("deleteItemsTouchedThreeTimes", this.item.id);

          this._openVideo();
        }

        if (isMultipleOfThree) {
          this.$store.commit("addItemsTouchedThreeTimes", this.item.id);
          this.$store.commit("deleteItemsTouchedTwoTimes", this.item.id);

          this._closeVideo();
        }
      } else {
        this._closeVideo();

        this.$store.commit("deleteItemsTouchedTwoTimes", this.item.id);
        this.$store.commit("deleteItemsTouchedThreeTimes", this.item.id);
      }
    },
    videoPlay: function (newValue) {
      // const element = document.getElementById("button");

      if (newValue) {
        setTimeout(() => {
          // (this.$refs.youtube as any).player.playVideo();
          this._playVideo();
          // element.click();
        }, 1000);
      }
    },
  },
  updated() {
    this._scrollToItem();
    this._plyrInit();
  },
  components: {
    YoutubeVue3,
  },
  methods: {
    _playVideo() {
      (this.plyrInstance as any).play();
      // (this.$refs.youtube as any).player.playVideo();
    },
    _openVideo() {
      if (this.item && this.item.videos && this.item.videos.length > 0) {
        this.videoPlayerHeight = 320;
        this.videoId = this.item.videos[0]["key"];
        this.videoPlay = true;
      }
    },
    _closeVideo() {
      if (this.item && this.item.videos && this.item.videos.length > 0) {
        this.videoPlayerHeight = 0;
        this.videoId = "";
        this.videoPlay = false;
      }
    },
    _changeColor() {
      const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];

      this.colorCurrent = randomColor;
      this.countTouches += 1;
    },
    _scrollToItem() {
      const element = (this.$refs[this.item.id] as any).$el; // Get the DOM element of the card
      const offsetTop = element.offsetTop;
      const offsetHeight = element.offsetHeight;
      const offsetBottom = offsetTop + offsetHeight + this.videoPlayerHeight;
      const cardRect = element.getBoundingClientRect();
      const cardHeight = cardRect.height + this.videoPlayerHeight;
      const windowHeight = window.innerHeight;

      // console.log('this.videoPlayerHeight', this.videoPlayerHeight);
      // console.log("cardHeight", cardHeight);
      // const result = offsetBottom - cardHeight - (windowHeight - cardHeight) / 2; // Get the top offset of the card element
      const result = offsetBottom - cardHeight - (windowHeight - cardHeight) / 2; // Get the top offset of the card element

      window.scrollTo({
        top: result,
        behavior: "smooth",
      });
    },
    _plyrInit() {
      const videoElement = this.$refs.video; // Assuming you have a <video> element in your template with the ref "video"
      const options = {
        controls: true, // Set to true or false depending on your requirements
        autoplay: true, // Enable autoplay
        fullscreen: false, // Disable fullscreen mode
        invertTime: false,
        youtube: {
          // Plyr configuration for YouTube videos
          noCookie: true, // Enable privacy-enhanced mode (optional)
          rel: 1, // Disable related videos (optional)
        },
      };

      let player = new Plyr(videoElement as any, options as any);
      player.source = {
        type: "video",
        sources: [
          {
            src: "https://www.youtube.com/watch?v=" + this.videoId, // Replace VIDEO_ID with your YouTube video ID
            provider: "youtube",
          },
        ],
      };

      this.plyrInstance = player;
    },
  },
};
</script>
