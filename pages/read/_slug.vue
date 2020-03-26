<template>
  <v-container>
    <div id="book"></div>
  </v-container>
</template>

<script>
  import {VContainer} from 'vuetify/lib'
  import Epub from 'epubjs'
  export default {
    components: {
      VContainer,
    },
    data () {
      return {
        bookURL: null,
        book: null,
      }
    },
    async mounted() {
      const storageRef = this.$fireStorage.ref().child('mark_tven-the_adventures_of_huckleberry_finn-1490207712.epub');
      try {
        this.bookURL = await storageRef.getDownloadURL();
        this.initReader()
      } catch (e) {
        alert(e.message)
      }
    },
    methods: {
      initReader() {
        this.book = new Epub(this.bookURL, {});
        this.rendition = this.book.renderTo('book', {
          contained: true,
          height: 400,
          width: 600,
        });
        this.rendition.display()
      },
    },
  };
</script>

<style scoped>

</style>
