<template>
  <v-bottom-sheet
    v-model="sheet"
    inset
  >
    <v-sheet
      class="pl-5 pa-2 text-left"
    >
      <div class="my-3 text">
        {{ selection }}
      </div>
      <hr>
      <div
        v-if="!error"
        class="my-3 text"
      >
        {{ translated }}
      </div>
      <div
        v-if="error"
        class="my-3"
      >
        Произошла ошибка или закончилась квота на перевод!
      </div>
    </v-sheet>
  </v-bottom-sheet>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'TranslationPopUp',
    props: {
      selection: {
        type: String,
        default: '',
      },
    },
    data: () => ({
      sheet: true,
      error: false,
      translated: '',
    }),
    async mounted() {
      this.translated = await this.translate();
    },
    methods: {
      async translate() {
        try {
          const response = await axios.post(encodeURI(
            `${process.env.TRANSLATION_BASE_URI}?key=${process.env.TRANSLATION_API_KEY}&lang=en-ru&text=${this.selection.replace(new RegExp(';', 'g'), ',')}`,
          ));
          return response.data.text[0];
        } catch (e) {
          this.error = true;
        }
      },
    },
  };
</script>

<style scoped>
  .text {
    font-size: 1.5rem!important;
    font-weight: 500;
  }
</style>
