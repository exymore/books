<template>
  <div class="container">
    <v-btn
      color="cyan lighten-4"
      fab
      large
      class="btn"
      @click="prev"
    >
      <v-icon
        class="white--text"
      >
        {{ 'mdi-chevron-left' }}
      </v-icon>
    </v-btn>
    <div
      class="reader-wrapper"
      v-html="readerHtml"
    />
    <v-btn
      color="cyan lighten-4"
      fab
      large
      class="btn"
      @click="debouncedNext"
    >
      <v-icon
        class="white--text"
      >
        {{ 'mdi-chevron-right' }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
  import debounce from 'lodash/throttle';

  export default {
    name: 'Reader',
    props: {
      readerHtml: {
        type: String,
        default: '',
      },
    },
    data: () => ({
      columnWidth: 0,
      el: null,
    }),
    watch: {
      el() {
        this.debouncedNext();
        this.debouncedPrev();
      },
    },
    created() {
      this.debouncedNext = debounce(this.next, 750, { trailing: false });
      this.debouncedPrev = debounce(this.prev, 750, { trailing: false });
    },
    mounted() {
      this.el = document.querySelector('.reader-wrapper');
      this.columnWidth = this.el.offsetWidth;
      this.el.style.columnWidth = this.columnWidth / 2;
    },
    methods: {
      next() {
        this.el.scroll({
          top: 0,
          left: this.el.scrollLeft + this.columnWidth + 16,
          behavior: 'smooth',
        });
      },
      prev() {
        this.el.scroll({
          top: 0,
          left: this.el.scrollLeft - this.columnWidth - 16,
          behavior: 'smooth',
        });
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

  .container {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .reader-wrapper {
    word-break: break-word;
    height: 80vh;
    width: 40vw;
    column-fill: balance;
    column-span: all;
    overflow-x: hidden;
    column-count: 2;
    column-width: 35vw;
    display: block;
  }
</style>
