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
      };
    },
    async mounted() {
      this.book = this.$store.state.books.find(book => book.sys.id === this.$route.params.slug);
      const bookFromDB = await DBApi.getByKey(this.book.sys.id);
      if (!bookFromDB) {
        const storageRef = this.$fireStorage.ref().child('mark-tven-the-adventures-of-huck/index.html');
        const bookURL = await storageRef.getDownloadURL();
        const bookHTML = await this.getBook(bookURL);
        await DBApi.save({ id: this.book.sys.id, value: bookHTML });
      }
    },
    methods: {
      async getBook(bookURL) {
        const options = {
          method: 'GET',
          url: bookURL,
        };
        const { data } = await axios(options);
        return data;
      },
      processDocument() {

      },
    },
  };
</script>

<style scoped>

</style>
