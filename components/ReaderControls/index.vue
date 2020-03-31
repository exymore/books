<template>
  <v-menu
    v-model="menu"
    transition="slide-x-transition"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-x
  >
    <template v-slot:activator="{ on }">
      <v-btn
        color="indigo"
        dark
        v-on="on"
      >
        Menu as Popover
      </v-btn>
    </template>

    <v-card>
      <v-list>
        <text-align v-on="$listeners" />
        <v-divider />
        <font-size v-on="$listeners" />
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
  import { bgColorsEnum, fontsEnum, fontSizeEnum, textAlignEnum } from '../../enums';
  import TextAlign from './TextAlign';
  import FontSize from './FontSize';

  export default {
    name: 'ReaderControls',
    components: { FontSize, TextAlign },
    data: () => ({
      showControls: true,
      menu: undefined,
    }),
  };
</script>

<style scoped>
  .v-list >>> .v-icon {
    font-size: 20px;
    color: #505050 !important;
  }

  .reader-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>
