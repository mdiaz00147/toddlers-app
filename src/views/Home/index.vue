<template>
  <v-container ref="container">
    <!-- <v-row>
      <v-btn
        class="text-white flex-grow-1 text-none"
        color="blue-darken-4"
        rounded="0"
        variant="flat"
        @click="_fetchItems()"
      >
        RUN
      </v-btn>
    </v-row> -->

    <v-row>
      <v-col :cols="_buildColumn(item)" v-for="(item, index) in itemsBuild">
        <div :class="item['cssClass']" :id="item['id']">
          <!-- <div class="mt-4 text-subtitle-2">With slots</div> -->
          <!-- {{ itemsTouchedTwoTimes }}
          {{ itemsTouchedThreeTimes }} -->
          <HomeCard :item="item"></HomeCard>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import axios from "axios";
import { mapGetters, mapActions, mapState } from "vuex";

import HomeCard from "./Card/index.vue";

export default {
  data() {
    const items: any[] = [];
    const itemsCols: any = {};

    return {
      items,
      itemsCols,
      count: 0,
      page: 1,
      urlsFetched: new Set(),
      itemsViewed: new Set(),
    };
  },
  computed: {
    ...mapState(["moviesList"]),

    ...mapGetters({
      itemsTouchedThreeTimes: "getItemsTouchedThreeTimes",
      itemsTouchedTwoTimes: "getItemsTouchedTwoTimes",
      moviesList: "getMoviesList",
    }),
    itemsBuild() {
      return this.items;
    },
  },
  components: {
    HomeCard,
  },
  mounted() {
    this._fetchItems();
    // this.buildMoviesListCache(this.page);

    this.$store.dispatch("reset");

    const containerElement = (this.$refs.container as any).$el;

    // Create a ResizeObserver instance
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Access the new height from the entry
        const newHeight = entry.contentRect.height;

        // Do something with the new height
        // console.log("Container height:", newHeight);
        this.$store.commit("setContainerHeight", newHeight);
      }
    });

    // Start observing the container element
    resizeObserver.observe(containerElement);
  },
  methods: {
    ...mapActions([
      "buildMoviesListCache", //also supports payload `this.nameOfAction(amount)`
    ]),
    async _fetchItems() {
      const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=${this.page}&sort_by=popularity.desc&with_genres=16`;
      const cacheKey = url;
      const cacheCurrent = this.moviesList[cacheKey];
      let resultsModified = [];

      // console.log("moviesList", this.moviesList[cacheKey]);
      // if (!this.urlsFetched.has(url)) {
      if (cacheCurrent) {
        resultsModified = cacheCurrent;
      } else {
        try {
          const response: any = await axios({
            method: "GET",
            url: url,
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZmM1NDFlM2I2ZTc1MzlhMzJkZWMyZDg2NGQxNTQ2ZCIsInN1YiI6IjVhMDRlMjhhOTI1MTQxNDAyZDAwMzZkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2vjszr39ldIXsE9oC1UVXfMdahG2AdGVF73YDvisK9k",
            },
          });

          if (response && response.data) {
            // this.urlsFetched.add(url);
            // console.log(this.urlsFetched);
            const results: any[] = response.data["results"];
            // const resultsModified = [];

            for (let index = 0; index < results.length; index++) {
              const element = results[index];
              // const elementImages = await this._fetchItemImages(element["id"]);
              const elementVideos = await this._fetchItemVideos(element["id"]);

              // element["images"] = elementImages;
              element["videos"] = elementVideos;

              // only display items with videos
              if (elementVideos && elementVideos.length > 0) {
                resultsModified.push(element);
              }
            }

            this.buildMoviesListCache({ cacheKey: cacheKey, items: resultsModified });
          }
        } catch (error) {
          console.log(error);
        }
        // }
      }

      for (let index = 0; index < resultsModified.length; index++) {
        const element = resultsModified[index];
        const isLast = resultsModified.length - 1 === index;
        const elementCssClass = isLast ? `item-last-${element["id"]}` : "";

        element["cssClass"] = elementCssClass;

        if (isLast) {
          this._scroll(elementCssClass);
        }
      }

      this.items = [...this.items, ...resultsModified];
    },
    async _fetchItemVideos(id: number | string): Promise<any[]> {
      // return "";
      let result: any[] = [];

      try {
        const response: any = await axios({
          method: "GET",
          url: `https://api.themoviedb.org/3/movie/${id}/videos`,
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZmM1NDFlM2I2ZTc1MzlhMzJkZWMyZDg2NGQxNTQ2ZCIsInN1YiI6IjVhMDRlMjhhOTI1MTQxNDAyZDAwMzZkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2vjszr39ldIXsE9oC1UVXfMdahG2AdGVF73YDvisK9k",
          },
        });

        if (
          response &&
          response.data &&
          response.data["results"] &&
          response.data["results"].length > 0
        ) {
          result = response.data["results"];
        }
      } catch (error) {
        console.log(error);
      }

      return result;
    },
    _scroll(elementClass: any) {
      window.onscroll = () => {
        let scrolledTo = document.querySelector("." + elementClass);

        if (scrolledTo && this._isScrolledIntoView(scrolledTo)) {
          // console.log("scrolled");
        }
      };
    },
    _isScrolledIntoView(element: any) {
      let rect = element.getBoundingClientRect();
      let elemTop = rect.top;
      let elemBottom = rect.bottom;

      let isVisible = elemTop < window.innerHeight && elemBottom >= 0;

      // console.log(element.id, isVisible);

      if (isVisible && !this.itemsViewed.has(element["id"])) {
        this.page += 1;
        this.itemsViewed.add(element["id"]);

        this._fetchItems();
        // this.buildMoviesListCache(this.page);
      }

      return isVisible;
    },
    _buildColumn(element: any) {
      let result = 4;

      if (this.itemsTouchedTwoTimes.includes(element["id"])) {
        result = 12;
      }

      if (this.itemsTouchedThreeTimes.includes(element["id"])) {
        result = 6;
      }

      return result;
    },
  },
};
</script>
