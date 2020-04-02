<template>
  <div>
    <v-skeleton-loader
      v-if="pagesCountLoading"
      type="avatar"
      class="mx-auto btn action-button-skeleton"
    />
    <v-btn
      v-else-if="!isMobile"
      color="cyan lighten-4"
      fab
      depressed
      large
      class="btn"
      @click="clickHandler(direction)"
    >
      <v-icon
        class="white--text"
      >
        {{ icon }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
  export default {
    name: 'ReaderActionButton',
    props: {
      icon: { type: String, default: '' },
      direction: { type: String, default: '' },
      pagesCountLoading: { type: Boolean, default: false },
    },
    computed: {
      isMobile() {
        if (process.client) return document.documentElement.clientWidth <= 960;
        return false;
      },
    },
    methods: {
      clickHandler(direction) {
        this.$emit('clickEffect', direction);
      },
    },
  };
</script>

<style scoped>
  .btn:first-child {
    margin-right: 48px !important;
  }

  .action-button-skeleton >>> .v-skeleton-loader__avatar {
    height: 64px !important;
    width: 64px !important;
  }

  .btn:last-child {
    margin-left: 48px !important;
  }
</style>
