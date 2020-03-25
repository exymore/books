<template>
  <v-card
    max-width="300"
    class="card"
  >
    <div class="bg-wrapper">
      <v-img
        class="blurred"
        height="300px"
        :src="coverUrl"
      />
      <v-img
        class="white--text align-end"
        height="200px"
        :src="coverUrl"
        contain
      />
    </div>


    <v-card-title class="title">
      {{ bookName }}
    </v-card-title>
    <v-card-subtitle class="pb-0">
      {{ truncateDescription(bookDescription) }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        color="purple"
        text
        :to="bookUrl"
      >
        Read
      </v-btn>

      <v-btn
        color="purple"
        text
        @click="handleShare"
      >
        Share
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: 'Book',
    props: {
      bookID: {
        type: String,
        default: '',
      },
      bookName: {
        type: String,
        default: '',
      },
      coverUrl: {
        type: String,
        default: '',
      },
      bookDescription: {
        type: String,
        default: '',
      },
    },
    computed: {
      bookUrl () {
        return `/read/${this.bookID}`
      },
    },
    methods: {
      truncateDescription(str) {
        if (str.length >= 150)
          return str.slice(0, 150).trim() + '...';
        return str;
      },
      handleShare() {
        if (navigator && navigator.share && window && window.location && window.location.href) {
          navigator.share({
            title: 'WebShare API Demo',
            url: `${window.location.href}/books/${this.bookID}`,
          }).catch(console.error);
        }
      },
    },
  };
</script>

<style scoped>
  .card {
    overflow: hidden;
  }

  .blurred {
    box-shadow: none;
    position: absolute;
    top: 0;
    filter: blur(12px);
    overflow: hidden;
  }

  .bg-wrapper {
    overflow: hidden;
    position: relative;
    transform: scale(1, 1);
    transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) 0s;
  }

  .bg-wrapper:hover {
    transform: scale(1.1, 1.1);
  }
</style>
