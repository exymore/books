<template>
  <v-list-item>
    <v-list-item-title>Размер шрифта</v-list-item-title>

    <v-list-item-action style="min-width: auto">
      <v-btn-toggle>
        <v-btn
          depressed
          :disabled="isBlocked(0)"
          style="height: 36px"
          @click="decreaseFont"
        >
          <v-icon>
            mdi-minus-circle-outline
          </v-icon>
        </v-btn>
        <v-btn
          depressed
          :disabled="isBlocked(1)"
          style="height: 36px"
          @click="increaseFont"
        >
          <v-icon>
            mdi-plus-circle-outline
          </v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
  export default {
    name: 'FontSize',
    props: {
      fontSizeControlsToBlock: Array,
      default: () => [],
    },
    methods: {
      increaseFont() {
        this.$emit('increaseFontSize');
      },
      decreaseFont() {
        this.$emit('decreaseFontSize');
      },
      isBlocked(num) {
        return this.fontSizeControlsToBlock[num];
      },
    },
  };
</script>

<style scoped>

</style>
