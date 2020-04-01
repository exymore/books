<template>
  <div>
    <reader-controls
      @toggleTextAlign="toggleTextAlign"
      @increaseFontSize="increaseFontSize"
      @decreaseFontSize="decreaseFontSize"
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
  import ReaderControls from './ReaderControls/index';
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
      bookId: {
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

      pagesCountLoading: true,
      currentPageNumber: 1,
      pagesCount: 0,
      bookWidth: 0,
      progress: 0,

      widthTimer: () => {
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
    watch: {
      currentPageNumber: {
        handler(val, oldVal) {
          this.saveToStorage(this.bookId, Number(this.currentPageNumber));
          const isNext = val > oldVal;
          const scrollLength = isNext ?
            this.el.scrollLeft + ((this.columnWidth + this.fontSizeNumeric(this.styleObject.fontSize)) * (val - oldVal)) :
            this.el.scrollLeft - ((this.columnWidth + this.fontSizeNumeric(this.styleObject.fontSize)) * (oldVal - val));
          this.el.scroll({
            top: 0,
            left: scrollLength,
            behavior: Math.abs(val - oldVal) > 1 ? 'auto' : 'smooth',
          });
        },
      },
    },
    created() {
      this.debouncedNext = debounce(this.next, 500, { trailing: false });
      this.debouncedPrev = debounce(this.prev, 500, { trailing: false });
    },
    mounted() {
      this.configureNavigation();
      this.configureStyling();
    },
    methods: {
      eventCB() {
        const rect = this.$refs.reader.children[2].getBoundingClientRect();
        let newBookLength;
        if (rect.height > rect.width) newBookLength = rect.height;
        else newBookLength = rect.width;
        
        console.log(newBookLength);
        if (this.bookWidth === newBookLength) {
          clearInterval(this.widthTimer);
          this.pagesCount = Math.round(this.bookWidth / (this.columnWidth + this.fontSizeNumeric(this.styleObject.fontSize)));
          this.pagesCountLoading = false;
        } else this.bookWidth = newBookLength;
      },
      // Navigation
      configureNavigation() {
        this.el = this.$refs.reader;
        this.columnWidth = this.el.offsetWidth;
        this.widthTimer = setInterval(this.eventCB, 500);

        const page = this.getFromStorage(this.bookId);
        if (!page) {
          this.saveToStorage(this.bookId, Number(this.currentPageNumber));
        } else this.currentPageNumber = Number(page);
      },

      // Styles
      configureStyling() {
        const textAlign = this.getFromStorage('textAlign');
        if (!textAlign) {
          this.saveToStorage('textAlign', this.styleObject.textAlign);
        } else this.styleObject.textAlign = textAlign;

        const fontSize = this.getFromStorage('fontSize');
        if (!fontSize) {
          this.saveToStorage('fontSize', this.styleObject.fontSize);
        } else this.styleObject.fontSize = fontSize;
      },

      // Styles Togglers
      toggleTextAlign(e) {
        this.styleObject = { ...this.styleObject, textAlign: textAlignEnum[Object.keys(textAlignEnum)[e]] };
        this.saveToStorage('textAlign', textAlignEnum[Object.keys(textAlignEnum)[e]]);
      },
      increaseFontSize() {
        const maxFontSize = Math.max.apply(null, Object.keys(fontSizeEnum));
        if (this.styleObject.fontSize !== `${maxFontSize}px`) {
          this.widthTimer = setInterval(this.eventCB, 500);
          const nextSize = Object.values(fontSizeEnum)[Object.entries(fontSizeEnum)
            .findIndex(el => el[1] === this.styleObject.fontSize) + 1];
          this.styleObject = { ...this.styleObject, fontSize: nextSize };
          this.saveToStorage('fontSize', nextSize);
        }
      },
      decreaseFontSize() {
        const minFontSize = Math.min.apply(null, Object.keys(fontSizeEnum));
        if (this.styleObject.fontSize !== `${minFontSize}px`) {
          this.widthTimer = setInterval(this.eventCB, 500);
          const nextSize = Object.values(fontSizeEnum)[Object.entries(fontSizeEnum)
            .findIndex(el => el[1] === this.styleObject.fontSize) - 1];
          this.styleObject = { ...this.styleObject, fontSize: nextSize };
          this.saveToStorage('fontSize', nextSize);
        }
      },
      // Reader controls
      next() {
        this.scrollPage(1);
      },
      prev() {
        this.scrollPage(-1);
      },
      scrollPage(num) {
        if (!(num < 0 && this.currentPageNumber === 1) && !(num > 0 && this.currentPageNumber === this.pagesCount)) {
          this.currentPageNumber += Number(num);
        }
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

      // Helpers
      fontSizeNumeric(val) {
        return Number(val.replace('px', ''));
      },
      saveToStorage(k, v) {
        localStorage.setItem(k, v);
      },
      getFromStorage(k) {
        if (process.client && localStorage) {
          const result = localStorage.getItem(k);
          if (result) {
            return result;
          }
          return null;
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
    width: 700px;
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
      width: 500px;
    }
  }

  @media (max-width: 480px) {
    .reader-wrapper {
      column-width: 90vw;
      width: 400px;
    }
  }
</style>
