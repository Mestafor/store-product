class MoreText {
  private readonly _wrapper: HTMLElement | null;
  private readonly _content: HTMLElement | null = null;
  private readonly _paragraph: HTMLElement | null = null;
  private readonly _link: HTMLElement | null = null;

  static CONTENT_SELECTOR = 'project-more-text__content';
  static LINK_SELECTOR = 'project-more-text__link';

  constructor(el: HTMLElement) {
    this._wrapper = el;

    if (this._wrapper) {
      this._content = el.querySelector(
        '.' + MoreText.CONTENT_SELECTOR
      ) as HTMLElement | null;
      // this._link = el.querySelector('.' + MoreText.LINK_SELECTOR);
      const children = el.children;
      for (let i = 0; i < children.length; i++) {
        if (children[i].classList.contains(MoreText.LINK_SELECTOR)) {
            this._link = children[i] as HTMLElement;
        }
      }

      if (this._content) {
        this._paragraph = this._content.querySelector('.project-more-text__inner-content');
      }
    }
  }

  init() {
    const el = this._wrapper;
    const content = this._content;
    const p = this._paragraph;
    const link = this._link;

    if (content && el && p && link) {

      link.addEventListener('click', (e: Event) => {
        e.preventDefault();
        if (el.classList.contains('show')) {
          this.close();
        } else {
          this.open();
        }
      });

      this._checkPSize();
    }
  }

  open() {
    const el = this._wrapper;
    const content = this._content;
    const p = this._paragraph;
    const link = this._link;

    if (content && el && p && link) {
      el.classList.add('show');
      content.style.maxHeight = 'unset';
    }
  }

  close() {
    const el = this._wrapper;
    const content = this._content;
    const p = this._paragraph;
    const link = this._link;

    if (content && el && p && link) {
      el.classList.remove('show');
      content.style.maxHeight = '';
    }
  }

  private _checkPSize() {
    // Check if all needed element exist
    const p = this._paragraph;
    const content = this._content;
    const link = this._link;

    if (p && content && link) {
      // Check paragraph and content size
      const paragraphHeight = p.clientHeight;
      const contentHeight = content.clientHeight;
      // If paragraph size is less then cotnent, hide 'Read more' link, otherwise show
      if (paragraphHeight <= contentHeight) {
        link.classList.add(MoreText.LINK_SELECTOR + '--hide');
      } else {
        link.classList.remove(MoreText.LINK_SELECTOR + '--hide');
      }
    }
  }

  onResize() {
    // Resize text
    
    this.close();
  }
}

class MoreTextManager {
  static moreTextInstances: MoreText[] = [];
  static instance: MoreTextManager | null = null;

  constructor() {
    if (MoreTextManager.instance instanceof MoreTextManager) {
      return MoreTextManager.instance;
    } else {
      MoreTextManager.instance = this;
    }
  }

  get moreTextInstances() {
    return MoreTextManager.moreTextInstances;
  }

  add(el: HTMLElement) {
    if (el) {
      const moreTextInstance = new MoreText(el);
      MoreTextManager.moreTextInstances.push(moreTextInstance);
      moreTextInstance.init();
    }
  }
}

export default new MoreTextManager();
