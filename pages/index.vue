<template>
  <div class="d-flex justify-center">
    <v-col
      v-for="{fields: {bookDescription, bookName, cover, cardColor, bookUrl}, sys} in books"
      :key="sys.id"
      cols="12"
      sm="3"
      md="4"
      lg="3"
    >
      <book
        :book-i-d="sys.id"
        :book-description="bookDescription"
        :book-name="bookName"
        :cover-url="cover.fields.file.url"
        :card-color="cardColor"
        :book-url="bookUrl"
      />
    </v-col>
  </div>
</template>

<script>
  import Book from '../components/Book';

  export default {
    components: { Book },
    computed: {
      books() {
        return this.$store.state.books;
      },
    },
  };
</script>

<style>
  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; /* 1 */
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }

  .links {
    padding-top: 15px;
  }
</style>
