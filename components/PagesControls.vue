<template>
  <div
    class="page-control"
  >
    <v-skeleton-loader
      v-if="loading"
      width="180"
      height="48"
      type="list-item"
      class="mx-auto skeleton-loader"
    />
    <v-progress-circular
      v-show="updating"
      :width="3"
      :size="18"
      indeterminate
      class="me-2"
      color="purple"
    />

    <v-menu
      v-if="!loading"
      v-model="menu"
      transition="slide-x-transition"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn
          class="format-icon"
          color="grey lighten-3"
          depressed
          v-on="on"
        >
          <span
            class="font-weight-medium"
          >
            Страница {{ currentPageNumber }} из {{ pagesCount }}
          </span>
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-slider
              v-model="slider"
              height="100"
              width="100"
              track-color="grey"
              persistent-hint
              always-dirty
              thumb-label="always"
              step="1"
              min="1"
              :max="pagesCount"
              @end="changePage"
              @mouseup="changePage"
            />
          </v-list-item>

          <v-divider />
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  export default {
    name: 'PagesControls',
    props: {
      currentPageNumber: {
        type: Number,
        default: 0,
      },
      pagesCount: {
        type: Number,
        default: 0,
      },
    },
    data: function() {
      return {
        loading: true,
        updating: false,
        menu: undefined,
        slider: 1,
      };
    },
    watch: {
      pagesCount: {
        handler(val, oldVal) {
          if (val !== 0) this.loading = false;
          if (oldVal !== null) this.updating = false;
        },
      },
      menu: function() {
        this.slider = this.currentPageNumber;
      },
    },
    created: function() {
      this.$parent.$on('fontSizeChanged', () => this.updating = true);
    },
    methods: {
      changePage(e) {
        console.log(e);
      },
    },
  };
</script>

<style scoped>
  .page-control {
    display: flex;
    align-items: center;
    padding: 0 16px;
  }

  .skeleton-loader >>> .v-skeleton-loader__list-item {
    padding-right: 0;
  }
</style>
