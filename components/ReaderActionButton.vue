<template>
  <div>
    <v-btn
      v-if="!isMobile"
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
    margin-right: 48px;
  }

  .btn:last-child {
    margin-left: 48px;
  }

  @media (max-width: 960px) {
    .btn {
      pointer-events: all;
      z-index: 1000;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      margin: 0 !important;
      padding: 0 !important;
      position: absolute;
    }
  }
</style>
