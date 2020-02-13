/**
 * Accordion details in single post
 */

interface IAccordion {
  accordion: HTMLElement;
}

export class Accordion {
  private config: IAccordion;
  private titleText: HTMLElement;
  private contentWrapper: HTMLElement;
  private content: HTMLElement;

  private TITLE_TEXT = '.project-accordion__title-text';
  private CONTENT_WRAPPER = '.project-accordion__content-wrapper';
  private CONTENT = '.project-accordion__content';
  private OPENED = 'project-accordion--opened';

  private state = {
    isOpen: false,
    isInited: false,
  };

  constructor(config: IAccordion) {
    this.config = config;

    this.titleText = this.config.accordion.querySelector(
      this.TITLE_TEXT
    ) as HTMLElement;
    this.contentWrapper = this.config.accordion.querySelector(
      this.CONTENT_WRAPPER
    ) as HTMLElement;
    this.content = this.config.accordion.querySelector(
      this.CONTENT
    ) as HTMLElement;

    if (this.titleText && this.contentWrapper && this.content) {
      this.titleText.addEventListener('click', e => {
        e.preventDefault();

        if (this.state.isOpen) {
          this.close();
        } else {
          this.open();
        }
      });

      this.state.isInited = true;
      this.config.accordion.classList.add('project-accordion--inited');
    }
  }

  open() {
    if (this.state.isOpen || !this.state.isInited) return;

    this.config.accordion.classList.add(this.OPENED);

    this.state.isOpen = true;
  }

  close() {
    if (!this.state.isOpen || !this.state.isInited) return;

    this.config.accordion.classList.remove(this.OPENED);

    this.state.isOpen = false;
  }
}
