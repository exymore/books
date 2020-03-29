<template>
  <v-container>
    <div />
  </v-container>
</template>

<script>
  import { VContainer } from 'vuetify/lib';
  import axios from 'axios';
  import DBApi from '@/api/idb';

  export default {
    components: {
      VContainer,
    },
    data() {
      return {
        book: null,
        bookURL: null,
        bookHTML: null,
      };
    },
    async mounted() {
      this.book = this.$store.state.books.find(book => book.sys.id === this.$route.params.slug);
      const storageRef = this.$fireStorage.ref().child('mark-tven-the-adventures-of-huck/index.html');
      this.bookURL = await storageRef.getDownloadURL();
      this.bookHTML = await this.getBook();
      await DBApi.saveBook({ id: this.book.sys.id, value: this.bookHTML });
    },
    methods: {
      async getBook() {
        const options = {
          method: 'GET',
          url: this.bookURL,
        };
        const { data } = await axios(options);
        return data;
      },
    },
  };
</script>

<style scoped>

</style>
