<template>
  <v-container>
    <v-row>
      <v-col cols="6" md="4" v-for="(item, index) in items">
        <div :class="item['cssClass']" :id="item['id']">
          <!-- <div class="mt-4 text-subtitle-2">With slots</div> -->

          <HomeCard :item="item"></HomeCard>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import axios from "axios";

import HomeCard from "./Card/";

export default {
  data() {
    return {
      count: 0,
      items: [],
      page: 1,
      urlsFetched: new Set(),
      itemsViewed: new Set(),
    };
  },
  components: {
    HomeCard
  },
  mounted() {
    this._fetchItems();
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
    _scroll(elementClass) {
      window.onscroll = () => {
        let scrolledTo = document.querySelector("." + elementClass);

        if (scrolledTo && this._isScrolledIntoView(scrolledTo)) {
          // console.log("scrolled");
        }
      };
    },
    _isScrolledIntoView(element) {
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
  },
};
</script>
