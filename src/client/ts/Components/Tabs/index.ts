import SmoothAnchor from "../SmoothAnchor";

/**
 * Tabs
 */
export interface ITab {
    setActive: (activeId: string) => void;
    clearActive: () => void;
}

interface ITabConfig {
    tab: HTMLElement;
    onChange?: () => void;
}

export class Tab implements ITab {
    private _titles: HTMLElement[] = [];
    private _config: ITabConfig;
    private _$titleWrapper: HTMLElement[] = [];
    private _$contentWrapper: HTMLElement | null;

    constructor(config: ITabConfig) {
        this._config = config;

        for (let i = 0; i < this._config.tab.children.length; i++) {
            if (
                this._config.tab.children[i].classList.contains('tabs__title-wrapper-scroll') ||
                this._config.tab.children[i].classList.contains('tabs__titles-wrapper')
            ) {
                this._$titleWrapper.push(this._config.tab.children[i] as HTMLElement);
            }
        }

        this._$contentWrapper = this._config.tab.querySelector('.tabs__content-wrapper');

        if (this._$titleWrapper) {
            this._$titleWrapper.forEach(titleWrapper => {
                titleWrapper.querySelectorAll<HTMLElement>(
                    'label[data-tab-id]:not(.tabs__title--inited)'
                ).forEach(title => {
                    this._titles.push(title);
                });
            });

            let activeId;
            if (this._$contentWrapper) {
                Array.from(this._$contentWrapper.children)
                    .forEach(input => {
                        if (input.tagName === 'INPUT') {
                            if ((input as HTMLInputElement).checked) {
                                activeId = input.getAttribute('id');
                            }

                            input.addEventListener('change', () => {
                                const id = input.getAttribute('id');

                                if ((input as HTMLInputElement).checked) {

                                    if (id) {
                                        this.setActive(id);
                                        this.showBlocksOnActive(id);

                                        if (this._config.tab.classList.contains('tabs--smooth-anchor')) {
                                            setTimeout(() => {
                                                new SmoothAnchor({}).scrollTo(this._config.tab);
                                            });
                                        }

                                    }
                                }
                                else {
                                    if (id) {
                                        this.hideBlocksOnActive(id);
                                    }
                                }
                            });
                        }
                    })
            }

            this._titles.forEach(title => {
                if (title.dataset.tabId === activeId) {
                    title.classList.add('tabs__title--active');
                }

                title.classList.add('tabs__title--inited');
            });
        }


        this._config.tab.classList.add('tabs--inited');
    }

    setActive(activeId: string) {
        this.clearActive();

        this._titles.forEach(title => {
            if (title.dataset.tabId === activeId) {
                title.classList.add('tabs__title--active');

                if(typeof this._config.onChange === 'function') {
                    this._config.onChange();
                }
            }

        });
    }

    clearActive() {
        this._titles && this._titles.forEach(title => {
            title.classList.remove('tabs__title--active');

            const id = title.getAttribute('data-tab-id');
            if (id) {
                this.hideBlocksOnActive(id);
            }
        });
    }

    private showBlocksOnActive(inputId: string) {
        document.querySelectorAll<HTMLElement>(`[data-show-on-tab-active="${inputId}"]`)
            .forEach(el => {
                el.classList.remove('hide');
            });
    }

    private hideBlocksOnActive(inputId: string) {
        document.querySelectorAll<HTMLElement>(`[data-hide-on-tab-active="${inputId}"]`)
            .forEach(el => {
                el.classList.add('hide');
            });
    }
}
