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
        <text-align v-on="$listeners"/>
        <v-divider/>
        <font-size
          :font-size-controls-to-block="fontSizeControlsToBlock"
          v-on="$listeners"
        />
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
  import TextAlign from './TextAlign';
  import FontSize from './FontSize';
  import { fontSizeEnum } from '../../enums';
  import last from 'lodash/last';
  import first from 'lodash/first';

  export default {
    name: 'ReaderControls',
    components: { FontSize, TextAlign },
    props: {
      isFontSizeUpdating: {
        type: Boolean,
        default: false,
      },
      fontSize: {
        type: String,
        default: fontSizeEnum['16'],
      },
    },
    data: () => ({
      menu: undefined,
    }),
    computed: {
      fontSizeControlsToBlock() {
        if (this.isFontSizeUpdating) return [true, true];
        if (this.fontSize === last(Object.values(fontSizeEnum))) return [false, true];
        if (this.fontSize === first(Object.values(fontSizeEnum))) return [true, false];
        return [false, false];
      },
    },
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
