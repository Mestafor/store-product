import helpers from '../../helpers';
// import './_animate-scroll-box.scss';

interface IShowInViewportParams {
  elems: HTMLElement[] | null;
  scroll: HTMLElement | Document;
  showCallback: () => void;
}

// Показує любі елеменити при скролі з заданим класом
class ShowInViewport {
  private static _activeClass: string;
  private _params: IShowInViewportParams;
  private copyElems: HTMLElement[] | null = null;
  private scrollBox: any;
  private _onScrolleThrottle: any;

  static get default() {
    return {
      elems: null,
      scroll: document,
      showCallback: () => {},
    };
  }

  constructor(params: IShowInViewportParams) {
    this._params = Object.assign({}, ShowInViewport.default, params);
    this._onScrolleThrottle = helpers.throttle(this._onScroll.bind(this), 0);
    this._init();
  }

  get elems() {
    return this._params.elems;
  }

  _init() {
    if (!this.elems || (this.elems && !this.elems.length)) {
      return;
    }

    if ('IntersectionObserver' in window) {
      // Test
      const lazyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            lazyObserver.unobserve(entry.target);
            entry.target.classList.add(ShowInViewport._activeClass);
          }
        });
      });

      this.elems.forEach(elem => {
        lazyObserver.observe(elem);
      });
    } else {
      this.copyElems = Array.from(this.elems);

      this._setScrollBox();
      this._onScroll();
      if (this._onScrolleThrottle) {
        this.scrollBox.addEventListener('scroll', this._onScrolleThrottle);
      }

      this._resize();
    }
  }

  _onScroll = () => {
    if (this.copyElems && !this.copyElems.length) {
      return;
    }

    if (this.copyElems) {
      this.copyElems = this.copyElems.filter(
        (item: HTMLElement): boolean => {
          const pos = item.getBoundingClientRect();
          if (pos.top < window.innerHeight) {
            item.classList.add(ShowInViewport._activeClass);
            return false;
          }

          return true;
        }
      );

      if (this.copyElems.length < 1) {
        this.copyElems = null;
        if (typeof this._params.showCallback === 'function') {
          this._params.showCallback();
        }
      }
    }

    if (!this.copyElems && this._onScrolleThrottle) {
      this.scrollBox.removeEventListener('scroll', this._onScrolleThrottle);
    }
  };

  _setScrollBox() {
    this.scrollBox = document;
  }

  _resize() {
    let timeout: number;
    const resize = (() => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        if (!this.copyElems) {
          window.removeEventListener('resize', resize);
          return;
        }

        this.scrollBox.removeEventListener('scroll', this._onScroll);
        this._setScrollBox();
        this.scrollBox.addEventListener('scroll', this._onScroll);
      }, 100);
    }).bind(this);

    window.addEventListener('resize', resize);
  }
}

Object.defineProperty(ShowInViewport, '_activeClass', {
  value: 'is-show',
  enumerable: false,
  writable: false,
  configurable: false,
});

export default ShowInViewport;
