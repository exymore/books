<template>
  <v-menu
    v-model="menu"
    transition="slide-x-transition"
    :close-on-content-click="false"
    :nudge-width="100"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-btn
        depressed
        color="grey lighten-3"
        class="format-icon"
        v-on="on"
      >
        <v-icon>
          mdi-format-letter-case-lower
        </v-icon>
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
  import TextAlign from './TextAlign';
  import FontSize from './FontSize';

  export default {
    name: 'ReaderControls',
    components: { FontSize, TextAlign },
    data: () => ({
      menu: undefined,
    }),
  };
</script>

<style scoped>
  .format-icon {
    height: 60px !important;
  }

  .format-icon >>> .v-icon {
    font-size: 48px;
    color: #505050 !important;
  }

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

  @media (max-width: 960px) {
    .format-icon {
      height: 42px !important;
    }

    .format-icon >>> .v-icon {
      font-size: 36px;
    }
  }
</style>
