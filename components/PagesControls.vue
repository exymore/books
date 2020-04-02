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
    <span
      v-if="!loading"
      class="font-weight-medium"
    >
      Страница {{ currentPageNumber }} из {{ pagesCount }}
    </span>
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
      };
    },
    watch: {
      pagesCount: {
        handler(val, oldVal) {
          if (val !== 0) this.loading = false;
          if (oldVal !== null) this.updating = false;
        },
      },
    },
    created: function() {
      this.$parent.$on('fontSizeChanged', () => this.updating = true);
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
