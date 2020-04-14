<template>
  <div>
    <v-btn
      depressed
      color="grey lighten-3"
      v-if="!expanded"
      class="translate-button"
      @click="expanded = true"
    >
      <v-icon>
        mdi-translate
      </v-icon>
    </v-btn>
    <v-bottom-sheet
      v-else
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
        <v-progress-circular
          v-if="!translated"
          indeterminate
          class="my-3 pl-5 pa-2"
          color="purple"
        />
        <div
          v-else
          class="my-3 text"
        >
          {{ error? `Произошла ошибка или закончилась квота на перевод!` : translated }}
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </div>
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
      isMobileBrowser: {
        type: Boolean,
        default: false,
      },
    },
    data: () => ({
      sheet: true,
      error: false,
      translated: '',
      expanded: false,
    }),
    watch: {
      expanded: {
        async handler(val) {
          if (val) {
            this.translated = await this.translate();
          }
        },
      },
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
  .v-sheet {
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }

  .translate-button >>> .v-icon {
    font-size: 48px;
    color: #505050 !important;
  }

  .translate-button {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 64px;
    height: 60px !important;
    margin-left: 1rem;

    transition: background-color 0.25s ease;
  }

  .text {
    font-size: 1.5rem !important;
    font-weight: 500;
  }

  @media (max-width: 960px) {
    .translate-button {
      height: 42px !important;
    }

    .translate-button >>> .v-icon {
      font-size: 36px;
    }
  }
</style>
