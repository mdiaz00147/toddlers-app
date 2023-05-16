<template>
  <v-container fluid>
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
      <v-col :cols="_buildColumn(item)" v-for="(item, index) in items">
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
import { mapGetters } from "vuex";

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
    ...mapGetters({
      itemsTouchedThreeTimes: "getItemsTouchedThreeTimes",
      itemsTouchedTwoTimes: "getItemsTouchedTwoTimes",
    }),
  },
  components: {
    HomeCard,
  },
  mounted() {
    this._fetchItems();

    this.$store.dispatch("reset");
  },
  methods: {
    async _fetchItems() {
      const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${this.page}&sort_by=popularity.desc&with_genres=16`;

      if (!this.urlsFetched.has(url)) {
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
            this.urlsFetched.add(url);
            // console.log(this.urlsFetched);
            const results: any[] = response.data["results"];
            const reusltsModified = [];

            for (let index = 0; index < results.length; index++) {
              const element = results[index];
              const elementImages = await this._fetchItemImage(element["id"]);
              const isLast = results.length - 1 === index;
              const elementCssClass = isLast ? `item-last-${element["id"]}` : "";

              element["images"] = elementImages;
              element["cssClass"] = elementCssClass;

              reusltsModified.push(element);

              if (isLast) {
                this._scroll(elementCssClass);
              }
            }

            this.items = [...this.items, ...reusltsModified];
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    async _fetchItemImage(id: number | string) {
      return "";

      let result: any;

      try {
        const response: any = await axios({
          method: "GET",
          url: `https://api.themoviedb.org/3/movie/${id}/images`,
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZmM1NDFlM2I2ZTc1MzlhMzJkZWMyZDg2NGQxNTQ2ZCIsInN1YiI6IjVhMDRlMjhhOTI1MTQxNDAyZDAwMzZkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2vjszr39ldIXsE9oC1UVXfMdahG2AdGVF73YDvisK9k",
          },
        });

        if (response && response.data) {
          result = response.data;
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

      // console.log(element);

      if (isVisible && !this.itemsViewed.has(element["id"])) {
        this.page += 1;
        this.itemsViewed.add(element["id"]);

        this._fetchItems();
      }

      return isVisible;
    },
    _buildColumn(element: object) {
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
