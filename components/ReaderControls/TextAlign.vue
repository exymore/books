<template>
  <v-list-item>
    <v-list-item-title>Положение текста</v-list-item-title>

    <v-list-item-action style="min-width: auto">
      <v-btn-toggle
        v-model="textAlign"
        mandatory
      >
        <v-btn
          depressed
          style="height: 36px"
        >
          <v-icon>
            mdi-format-align-left
          </v-icon>
        </v-btn>
        <v-btn
          depressed
          style="height: 36px"
        >
          <v-icon>
            mdi-format-align-justify
          </v-icon>
        </v-btn>
        <v-btn
          depressed
          style="height: 36px"
        >
          <v-icon>
            mdi-format-align-right
          </v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
  import { textAlignEnum } from '../../enums';
  export default {
    name: 'TextAlign',
    data: () => ({
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
      this.textAlign = Object.entries(textAlignEnum).findIndex(el => el[1] === align);
    },
  };
</script>

<style scoped>

</style>
