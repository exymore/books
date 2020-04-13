<template>
  <v-hover
    v-slot:default="{ hover }"
  >
    <v-card
      :elevation="hover ? 8 : 0"
      max-width="320"
      class="card"
      :color="cardColor || 'cyan darken-2'"
    >
      <nuxt-link :to="readBookUrl">
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
      </nuxt-link>

      <v-card-title class="title white--text">
        {{ bookName }}
      </v-card-title>
      <v-expand-transition>
        <div v-show="!showFullDescription">
          <v-card-subtitle class="desc white--text">
            {{ truncateDescription(bookDescription) }}
          </v-card-subtitle>
        </div>
      </v-expand-transition>

      <v-expand-transition>
        <div v-show="showFullDescription">
          <v-card-text class="desc white--text">
            {{ bookDescription }}
          </v-card-text>
        </div>
      </v-expand-transition>

      <v-card-actions>
        <v-btn
          text
          color="white"
          :to="readBookUrl"
        >
          Читать
        </v-btn>

        <v-btn
          color="white"
          text
          @click="handleShare"
        >
          Поделиться
        </v-btn>
        <v-spacer/>
        <v-btn
          v-if="isFullDescriptionRequired"
          icon
          @click="showFullDescription = !showFullDescription"
        >
          <v-icon
            class="white--text"
          >
            {{ showFullDescription ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
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
      cardColor: {
        type: String,
        default: '',
      },
      bookUrl: {
        type: String,
        default: '',
      },
    },
    data: () => ({
      isFullDescriptionRequired: false,
      showFullDescription: false,
    }),
    computed: {
      readBookUrl() {
        return `/read/${this.bookID}`;
      },
    },
    methods: {
      truncateDescription(str) {
        if (str.length >= 150) {
          this.isFullDescriptionRequired = true;
          return str.slice(0, 150).trim() + '...';
        }
        this.isFullDescriptionRequired = false;
        return str;
      },
      handleShare() {
        if (navigator && navigator.share && window && window.location && window.location.href) {
          navigator.share({
            title: 'Books Learn',
            url: `${window.location.href}books/${this.bookID}`,
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

  .desc {
    padding-top: 0;
  }

  .title {
    word-break: break-word !important;
  }

  .blurred {
    box-shadow: none;
    position: absolute;
    top: 0;
    filter: blur(8px);
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
