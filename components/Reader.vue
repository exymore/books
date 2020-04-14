<template>
  <div>
    <TranslationPopUp
      v-if="selection"
      :selection="selection"
    />
    <div class="controls">
      <reader-controls
        :font-size="styleObject.fontSize"
        :is-font-size-updating="isFontSizeUpdating"
        @toggleTextAlign="toggleTextAlign"
        @increaseFontSize="increaseFontSize"
        @decreaseFontSize="decreaseFontSize"
      />
      <pages-controls
        :current-page-number="currentPageNumber"
        :pages-count="pagesCount"
        @updatedFontSize="onFontSizeUpdated"
        @pageChanged="onPageChanged"
      />
    </div>
    <div
      class="container"
    >
      <reader-action-button
        :icon="'mdi-chevron-left'"
        :direction="'prev'"
        :pages-count-loading="pagesCountLoading"
        @clickEffect="clickEffect"
        @touchEffect="touchEffect"
      />
      <v-skeleton-loader
        v-if="pagesCountLoading || isFontSizeUpdating"
        type="image"
        class="mx-auto reader-skeleton"
      />
      <div
        ref="reader"
        v-touch:swipe.left="() => touchEffect('left')"
        v-touch:swipe.right="() => touchEffect('right')"
        :style="styleObject"
        class="reader-wrapper"
        v-dompurify-html="readerHtml"
      />
      <reader-action-button
        :icon="'mdi-chevron-right'"
        :direction="'next'"
        :pages-count-loading="pagesCountLoading"
        @clickEffect="clickEffect"
        @touchEffect="touchEffect"
      />
    </div>
  </div>
</template>

<script>
  import throttle from 'lodash/throttle';
  import debounce from 'lodash/debounce';
  import round from 'lodash/round';
  import floor from 'lodash/floor';
  import ceil from 'lodash/ceil';
  import ReaderActionButton from './ReaderActionButton';
  import Vue from 'vue';
  import Vue2TouchEvents from 'vue2-touch-events';
  import ReaderControls from './ReaderControls/index';
  import TranslationPopUp from './TranslationPopUp';
  import { bgColorsEnum, fontsEnum, fontSizeEnum, textAlignEnum } from '../enums';
  import PagesControls from './PagesControls';
  import VueDOMPurifyHTML from 'vue-dompurify-html';

  Vue.use(VueDOMPurifyHTML);
  Vue.use(Vue2TouchEvents);

  export default {
    name: 'Reader',
    components: {
      PagesControls,
      ReaderActionButton,
      ReaderControls,
      TranslationPopUp,
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
      isFontSizeUpdating: false,

      selection: '',
      isMouseDown: false,

      INTERNAL_books_width_array: [],
      INTERNAL_column_width_array: [],

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
      isMobileBrowser() {
        return (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1);
      },
    },
    watch: {
      currentPageNumber: {
        handler(val, oldVal) {
          this.saveToStorage(this.bookId, Number(this.currentPageNumber));

          const newScrollLengthForCurrentPage = ((this.columnWidth + this.fontSizeNumeric(this.styleObject.fontSize)) * (val - 1));
          this.el.scroll({
            top: 0,
            left: newScrollLengthForCurrentPage,
            behavior: 'auto',
          });
        },
      },
      pagesCount: {
        handler(val, oldVal) {
          if (oldVal) {
            const prevProgress = this.currentPageNumber / oldVal;
            const flooredDivergence = Math.abs(floor(prevProgress * val) / val - prevProgress);
            const ceiledDivergence = Math.abs(ceil(prevProgress * val) / val - prevProgress);

            const minDivergence = Math.min(ceiledDivergence, flooredDivergence);

            if (minDivergence === flooredDivergence) this.currentPageNumber = floor(prevProgress * val);
            if (minDivergence === ceiledDivergence) this.currentPageNumber = ceil(prevProgress * val);
          }
        },
      },
    },
    created() {
      this.throttledNext = throttle(this.next, 500, { trailing: false });
      this.throttledPrev = throttle(this.prev, 500, { trailing: false });
      this.throttledIncreaseFont = throttle(this._increaseFontSize, 750, { trailing: false });
      this.throttledDecreaseFont = throttle(this._decreaseFontSize, 750, { trailing: false });
    },
    mounted() {
      this.configureStyling();
      this.widthTimer = setInterval(this.eventCB, 50);
      if (this.isMobileBrowser) {
        document.addEventListener('touchstart', () => {
          this.isMouseDown = true;
        });
        document.addEventListener('touchend', () => {
          this.isMouseDown = false;
          this.injectSelectionTranslate();
        });
      }
      if (!this.isMobileBrowser) {
        document.addEventListener('mousedown', () => {
          this.isMouseDown = true;
        });
        document.addEventListener('mouseup', () => {
          this.isMouseDown = false;
          this.injectSelectionTranslate();
        });
      }

      document.addEventListener('selectionchange', () => {
        this.injectSelectionTranslate();
      });
    },
    destroyed() {
      clearInterval(this.widthTimer);
      if (this.isMobileBrowser) {
        document.removeEventListener('touchstart', () => {
        });
        document.removeEventListener('touchend', () => {
        });
      }
      if (!this.isMobileBrowser) {
        document.removeEventListener('mousedown', () => {
        });
        document.removeEventListener('mouseup', () => {
        });
      }
      document.removeEventListener('selectionchange', () => {
      });
    },
    methods: {
      _INTERNAL_validate_book_width(newBookLength) {
        this.INTERNAL_books_width_array = [...this.INTERNAL_books_width_array, newBookLength];
        const necessaryIterations = 12;
        let successIterations = 0;
        const targetElement = this.INTERNAL_books_width_array[this.INTERNAL_books_width_array.length - 1];

        for (let i of [...this.INTERNAL_books_width_array].slice(-necessaryIterations)) {
          if (i === targetElement && successIterations < necessaryIterations) {
            successIterations++;
          }
        }
        return successIterations === necessaryIterations;
      },
      _INTERNAL_validate_column_width(columnWidth) {
        this.INTERNAL_column_width_array = [...this.INTERNAL_column_width_array, columnWidth];
        const necessaryIterations = 12;
        let successIterations = 0;
        const targetElement = this.INTERNAL_column_width_array[this.INTERNAL_column_width_array.length - 1];

        for (let i of [...this.INTERNAL_column_width_array].slice(-necessaryIterations)) {
          if (i !== 0 && i === targetElement && successIterations < necessaryIterations) {
            successIterations++;
          }
        }
        return successIterations === necessaryIterations;
      },
      eventCB() {
        this.el = this.$refs.reader;
        this.columnWidth = this.el.offsetWidth;
        const rect = this.el.scrollWidth;

        if (this._INTERNAL_validate_book_width(rect) && this._INTERNAL_validate_column_width(this.columnWidth)) {
          clearInterval(this.widthTimer);
          this.pagesCount = round(this.bookWidth / (this.columnWidth + this.fontSizeNumeric(this.styleObject.fontSize)));
          const page = this.getFromStorage(this.bookId);
          if (!page) {
            this.saveToStorage(this.bookId, Number(this.currentPageNumber));
          } else this.currentPageNumber = Number(page);

          this.pagesCountLoading = false;
        } else this.bookWidth = rect;
      },

      // Navigation
      onPageChanged(e) {
        this.currentPageNumber = e;
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
        this.throttledIncreaseFont();
      },
      decreaseFontSize() {
        this.throttledDecreaseFont();
      },
      _increaseFontSize() {
        const maxFontSize = Math.max.apply(null, Object.keys(fontSizeEnum));
        if (this.styleObject.fontSize !== `${maxFontSize}px`) {

          this.isFontSizeUpdating = true;
          this.widthTimer = setInterval(this.eventCB, 50);
          const nextSize = Object.values(fontSizeEnum)[Object.entries(fontSizeEnum)
            .findIndex(el => el[1] === this.styleObject.fontSize) + 1];
          this.styleObject = { ...this.styleObject, fontSize: nextSize };
          this.saveToStorage('fontSize', nextSize);
          this.$emit('fontSizeChanged');
        }
      },
      _decreaseFontSize() {
        const minFontSize = Math.min.apply(null, Object.keys(fontSizeEnum));
        if (this.styleObject.fontSize !== `${minFontSize}px`) {

          this.isFontSizeUpdating = true;
          this.widthTimer = setInterval(this.eventCB, 50);
          const nextSize = Object.values(fontSizeEnum)[Object.entries(fontSizeEnum)
            .findIndex(el => el[1] === this.styleObject.fontSize) - 1];
          this.styleObject = { ...this.styleObject, fontSize: nextSize };
          this.saveToStorage('fontSize', nextSize);
          this.$emit('fontSizeChanged');
        }
      },
      onFontSizeUpdated() {
        this.isFontSizeUpdating = false;
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
        if (e === 'next') this.throttledNext();
        else if (e === 'prev') this.throttledPrev();
      },
      touchEffect(e) {
        if (this.isMobile) {
          if (e === 'left') this.throttledNext();
          else if (e === 'right') this.throttledPrev();
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

      // Selection
      injectSelectionTranslate() {
        if (!this.isMouseDown) {
          const s = window.getSelection();
          const selection = s.toString().trim();
          if (selection !== '' && selection !== null && selection !== undefined && selection.length > 0 && selection.length <= 400) {
            this.selection = selection;
          } else if (selection === '' || selection === null || selection === undefined) {
            this.selection = '';
          }
        }
      },
    },
  };
</script>

<style scoped>
  .container {
    padding: 12px !important;
    margin-right: auto !important;
    margin-left: auto !important;
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

  .reader-skeleton {
    position: absolute;
    z-index: 1;
    height: calc(80vh + 8px);
    width: 708px;
  }

  .reader-skeleton >>> .v-skeleton-loader__image {
    height: calc(80vh + 8px) !important;
    background: #e0e0e0 !important;
  }

  .controls {
    display: flex;
    justify-content: space-between;
  }

  @media (max-width: 1200px) {
    .reader-skeleton {
      width: 600px;
    }
  }

  @media (max-width: 960px) {
    .reader-wrapper {
      column-width: 80vw;
      width: 500px;
    }

    .reader-skeleton {
      width: 520px;
    }

    .controls {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  @media (max-width: 480px) {
    .reader-wrapper {
      column-width: 90vw;
      width: 400px;
    }

    .reader-skeleton {
      width: 400px;
    }
  }

  @media (max-width: 400px) {
    .reader-skeleton {
      width: 320px;
    }
  }
</style>
