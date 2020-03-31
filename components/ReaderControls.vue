<template>
  <div class="reader-controls">
    <v-btn
      icon
      class="align-center"
      @click="showControls = !showControls"
    >
      <v-icon>{{ showControls ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
    </v-btn>

    <v-expand-transition>
      <div v-show="showControls">
        <v-btn-toggle
          v-model="textAlign"
          mandatory
        >
          <v-btn>
            <v-icon>mdi-format-align-left</v-icon>
          </v-btn>
          <v-btn>
            <v-icon>mdi-format-align-justify</v-icon>
          </v-btn>
          <v-btn>
            <v-icon>mdi-format-align-right</v-icon>
          </v-btn>
        </v-btn-toggle>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
  import { bgColorsEnum, fontsEnum, fontSizeEnum, textAlignEnum } from '../enums';

  export default {
    name: 'ReaderControls',
    data: () => ({
      showControls: true,
      textAlign: 0,
    }),
    watch: {
      textAlign: function() {
        if (this.textAlign !== undefined) {
          this.$emit('toggleTextAlign', this.textAlign);
        }
      },
    },
    mounted() {
      const align = localStorage.getItem('textAlign');
      this.textAlign = Object.entries(textAlignEnum).findIndex(el => el[1] === align)
    },
  };
</script>

<style scoped>
  .reader-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
