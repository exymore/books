<template>
  <div>
    <reader-controls
      @toggleTextAlign="toggleTextAlign"
    />
    <div
      class="container"
    >
      <reader-action-button
        :icon="'mdi-chevron-left'"
        :direction="'prev'"
        @clickEffect="clickEffect"
        @touchEffect="touchEffect"
      />
      <div
        ref="reader"
        v-touch:swipe.left="() => touchEffect('left')"
        v-touch:swipe.right="() => touchEffect('right')"
        :style="styleObject"
        class="reader-wrapper times"
        v-html="readerHtml"
      />
      <reader-action-button
        :icon="'mdi-chevron-right'"
        :direction="'next'"
        @clickEffect="clickEffect"
        @touchEffect="touchEffect"
      />
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash/throttle';
  import ReaderActionButton from './ReaderActionButton';
  import Vue from 'vue';
  import Vue2TouchEvents from 'vue2-touch-events';
  import ReaderControls from './ReaderControls';
  import { bgColorsEnum, fontsEnum, fontSizeEnum, textAlignEnum } from '../enums';

  Vue.use(Vue2TouchEvents);

  export default {
    name: 'Reader',
    components: {
      ReaderActionButton,
      ReaderControls,
    },
    props: {
      readerHtml: {
        type: String,
        default: '',
      },
    },
    data: () => ({
      columnWidth: 0,
      el: null,
      styleObject: {
        backgroundColor: bgColorsEnum.white,
        fontFamily: fontsEnum.times,
        fontSize: fontSizeEnum['16'],
        textAlign: textAlignEnum.justify,
      },
    }),
    computed: {
      screenSize() {
        return {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
        };
      },
      isMobile() {
        if (process.client) return this.screenSize.width <= 960;
        return false;
      },
    },
    created() {
      this.debouncedNext = debounce(this.next, 750, { trailing: false });
      this.debouncedPrev = debounce(this.prev, 750, { trailing: false });
    },
    mounted() {
      this.configureStyling();
      this.el = this.$refs.reader;
      this.columnWidth = this.el.offsetWidth;
    },
    methods: {
      configureStyling() {
        const textAlign = this.getStyle('textAlign');
        if (textAlign) {
          this.styleObject.textAlign = textAlign;
        } else {
          this.saveStyle('textAlign', this.styleObject.textAlign);
        }
      },
      saveStyle(k, v) {
        localStorage.setItem(k, v);
      },
      getStyle(k) {
        if (process.client && localStorage) {
          const result = localStorage.getItem(k);
          if (result) {
            return result;
          }
          return null;
        }
      },
      toggleTextAlign(e) {
        this.styleObject.textAlign = textAlignEnum[Object.keys(textAlignEnum)[e]];
        this.saveStyle('textAlign', textAlignEnum[Object.keys(textAlignEnum)[e]]);
      },
      next() {
        this.el.scroll({
          top: 0,
          left: this.el.scrollLeft + this.columnWidth + 16,
          behavior: 'smooth',
        });
      },
      prev() {
        this.el.scroll({
          top: 0,
          left: this.el.scrollLeft - this.columnWidth - 16,
          behavior: 'smooth',
        });
      },
      clickEffect(e) {
        if (e === 'next') this.debouncedNext();
        else if (e === 'prev') this.debouncedPrev();
      },
      touchEffect(e) {
        if (this.isMobile) {
          if (e === 'left') this.debouncedNext();
          else if (e === 'right') this.debouncedPrev();
        }
      },
    },
  };
</script>

<style scoped>
  .container {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    min-height: 100%;
  }

  .reader-wrapper >>> img {
    max-height: 100%;
    max-width: 100%;
  }

  .reader-wrapper >>> p {
    margin: 0;
  }

  .reader-wrapper >>> .title {
    font-size: inherit !important;
    font-family: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    letter-spacing: inherit !important;
  }

  .reader-wrapper {
    word-break: break-word;
    height: 80vh;
    width: 40vw;
    column-fill: balance;
    column-span: all;
    overflow-x: hidden;
    column-count: 1;
    column-width: 35vw;
    display: block;
  }

  @media (max-width: 960px) {
    .reader-wrapper {
      column-width: 80vw;
      width: 80vw;
    }
  }

  @media (max-width: 480px) {
    .reader-wrapper {
      column-width: 90vw;
      width: 90vw;
    }
  }
</style>
