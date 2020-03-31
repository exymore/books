<template>
  <v-list-item>
    <v-list-item-title>Размер шрифта</v-list-item-title>

    <v-list-item-action style="min-width: auto">
      <v-btn-toggle>
        <v-btn
          depressed
          style="height: 36px"
          @click="decreaseFont"
        >
          <v-icon>
            mdi-minus-circle-outline
          </v-icon>
        </v-btn>
        <v-btn
          depressed
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
    methods: {
      increaseFont() {
        this.$emit('increaseFontSize');
      },
      decreaseFont() {
        this.$emit('decreaseFontSize');
      },
    },
  };
</script>

<style scoped>

</style>
