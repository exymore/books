<template>
  <v-container>
    <div v-html="bookHTML" />
  </v-container>
</template>

<script>
  import { VContainer } from 'vuetify/lib';
  import axios from 'axios';

  export default {
    components: {
      VContainer,
    },
    data() {
      return {
        bookURL: null,
        bookHTML: null,
      };
    },
    async mounted() {
      const storageRef = this.$fireStorage.ref().child('mark-tven-the-adventures-of-huck/index.html');
      this.bookURL = await storageRef.getDownloadURL();
      this.bookHTML = await this.getBook();
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
