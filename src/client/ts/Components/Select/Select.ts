import helpers from '../../helpers';
import { ClickableItemStore } from '../DropDown';

interface ISelectArgv {
    wrapper: HTMLSelectElement;
    value?: string | undefined | null;
}

enum SelectItemsClass {
    INITED = '--select-inited',
    WRAPPER = 'project-select',
    ACCORDION = 'project-select--accordion',
    OPTIONS_IS_OPEN = 'project-select--options-is-open',
    TITLE = 'project-select__title',
    TITLE_TEXT = 'project-select__title-text',
    OPTIONS = 'project-select__options',
    LIST = 'project-select__list',
    LIST_ITEM = 'project-select__list-item',
    LIST_ITEM_ACTIVE = 'project-select__list-item--active',
    ARROW = 'project-select__arrow',
    ERROR = 'error--active',
    FOCUSED = 'hover-box--focused',
    TOGGLE_SELECT = 'project-select__toggle'
}

export class Select {
    private static activeSelect: Select | null;
    private _argv: ISelectArgv;
    private _$wrapper: HTMLElement | null;
    private _$field: HTMLSelectElement | null;
    private _$title: HTMLElement | null;
    private _$titleText: HTMLElement | null;
    private _$options: HTMLElement | null;
    private _$list: HTMLElement | null;
    // private _arrow: HTMLElement;
    private _selected: Array<string | null> = [];
    private _target: EventTarget | null = null;
    private _isOpen = false;
    private _isOpened = false;
    private _customChangeEvent: any;

    get isOpen() {
        return this._isOpen;
    }

    set isOpen(isOpen: boolean) {
        this._isOpen = isOpen;

        this._updateView();
    }

    constructor(argv: ISelectArgv) {
        this._argv = argv;

        this._$wrapper = this._argv.wrapper;
        this._$field = this._$wrapper.querySelector('select');
        this._$title = this._$wrapper.querySelector('.' + SelectItemsClass.TITLE);
        this._$titleText = this._$wrapper.querySelector(
            '.' + SelectItemsClass.TITLE_TEXT
        );
        this._$options = this._$wrapper.querySelector('.' + SelectItemsClass.OPTIONS);
        this._$list = this._$wrapper.querySelector('.' + SelectItemsClass.LIST);


        this._customChangeEvent = new CustomEvent('change', {
            bubbles: true,
            cancelable: false,
        });

        if (this._$field) {
            if (this._argv.value) {
                this._$field.value = this._argv.value;
                this._$field.dispatchEvent(this._customChangeEvent);
            }
            this._setActiveBySelect(this._$field);
            this._$field.addEventListener<'change'>('change', e => {
                const select = e.currentTarget as HTMLSelectElement;
                this._setActiveBySelect(select);
            });

            this._$field.addEventListener<'click'>('click', e => {
                e.stopPropagation();
            });

            this._$field.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();
            });
        }

        if (this._$options) {
            this._$options.addEventListener<'click'>('click', e => {
                e.stopPropagation();
            });
        }


        if (this._$options && this._$options.classList.contains('project-select__options--fixed')) {

            document.body.appendChild(this._$options);
        }

        this._$wrapper.querySelectorAll<HTMLElement>(`.${SelectItemsClass.TOGGLE_SELECT}`)
            .forEach($el => {
                $el.addEventListener<'click'>('click', e => {
                    e.preventDefault();
                    e.stopPropagation();

                    this.isOpen = !this.isOpen;
                });
            });

        // this._wrapper = document.createElement('DIV');
        // this._title = document.createElement('SPAN');
        // this._options = document.createElement('DIV');
        // this._list = document.createElement('DIV');
        // this._arrow = document.createElement('span');
        // this._arrow.classList.add(SelectItemsClass.ARROW);
        // this._arrow.innerHTML = `<span class="text-style-1">Arrow</span>`;

        // this._list.classList.add('cs-options__list');

        // this._createSelect();
        this._onClick();
        this.closeView = this.closeView.bind(this);

        this._$wrapper.classList.add('project-select--inited');
    }

    private _updateView() {
        ClickableItemStore.close();

        if (this.isOpen) {
            ClickableItemStore.add(this);
            this.open(this._$title);
        }
        else {
            ClickableItemStore.close();
        }

    }

    private _setActiveBySelect(select) {
        if (this._$list) {
            const itemSelector = `[data-value="${select.value}"]`;
            const item = this._$list.querySelector(itemSelector);
            if (item && item.classList.contains(SelectItemsClass.LIST_ITEM_ACTIVE)) {
                // Do nothing
            } else if (item) {
                this._setActive(item);
            } else {
                console.error(`Item ${select.value} not found`);
            }
        }
    }

    private get field() {
        return this._$field;
    }

    private _onClick() {

        if (this._$list) {
            this._$list.addEventListener('click', e => {
                const target = e.target as HTMLElement;
                if (target.classList.contains(SelectItemsClass.LIST_ITEM)) {
                    // run open
                    e.preventDefault();
                    e.stopPropagation();
                    this._setActive(target);

                    if (this.field) {
                        this.field.dispatchEvent(this._customChangeEvent);
                        !this.field.multiple && this.close();
                    }
                }
            });
        }
        // }

        /**
         * Click on list item
         */
        if (this._$title) {
            this._$title.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();

                if (window.innerWidth > 991) {
                    this.isOpen = !this.isOpen;
                } else if (this._$field) {
                }
            });
        }
    }

    private _setActive(target: any) {
        const index = target.getAttribute('data-index');

        if (this._$wrapper) {
            if (index == '0') {
                this._$wrapper.classList.remove('project-select--selected');
            } else {
                this._$wrapper.classList.add('project-select--selected');
            }
        }

        if (this.field && this._$list) {
            if (this.field.multiple) {
                this._selected.push(this.field.options[index].textContent);
            } else {

                const $activeList = this._$list.querySelectorAll<HTMLElement>(
                    '.' + SelectItemsClass.LIST_ITEM_ACTIVE
                )

                $activeList.forEach(item => {
                    console.log(item);
                    item.classList.remove(SelectItemsClass.LIST_ITEM_ACTIVE);
                });
                this._selected = [this.field.options[index].textContent];
            }

            target.classList.add(SelectItemsClass.LIST_ITEM_ACTIVE);
            this.field.options[index].selected = true;
            // }

            const html = target.querySelector('[data-use-html]');

            if (html !== null) {
                if (html) {
                    this.setTitle(html.innerHTML);
                }
            } else {
                const title = target.dataset.title;
                if (title) {
                    this.setTitle(title);
                }
            }
        }
    }

    private setTitle(text: string): void {
        if (this._$titleText) {
            this._$titleText.innerHTML = `
            ${text.length ? text : 'Select'}
      `;
        }
    }

    private open(target: any) {
        //if (Select.activeSelect instanceof Select && Select.activeSelect !== this) {
        //    Select.activeSelect.close();
        //}

        const wrapper = this._$wrapper as HTMLElement;
        const hoverItem = helpers.getParentByClass(wrapper, 'hover-box__item--show-on-hover');
        const postItem = helpers.getParentByClass(wrapper, 'project-product');

        // OPEN
        wrapper && wrapper.classList.add(SelectItemsClass.OPTIONS_IS_OPEN);
        hoverItem && hoverItem.classList.add(SelectItemsClass.FOCUSED);
        target.parentNode.classList.remove(SelectItemsClass.ERROR);
        this._isOpened = true;

        Select.activeSelect = this;

        if (this._$wrapper && !this._$wrapper.classList.contains(SelectItemsClass.ACCORDION)) {
            document.addEventListener('click', this.closeView);
        }

        if (postItem) {
            postItem.style.zIndex = "2";
            postItem.classList.add('js-dropdown-opened');
        }

        //
        if (this._$options && this._$options.classList.contains('project-select__options--fixed')) {
            const wrapperPos = wrapper.getBoundingClientRect();
            const topScroll = helpers.getScrollState(document).scrollTop;
            this._$options.style.left = `${wrapperPos.left}px`;
            this._$options.style.top = `${topScroll + wrapperPos.top}px`;
            this._$options.style.minWidth = `${wrapperPos.width}px`;
            this._$options.style.zIndex = '1000';
            this._$options.style.display = 'block';
        }
    }

    close() {
        if (this.isOpen) {
            this.isOpen = false;
        }
        else {
            if (!this._$wrapper || !this._$title) {
                return;
            }

            this._$wrapper.classList.remove(SelectItemsClass.OPTIONS_IS_OPEN);
            this._isOpened = false;

            const hoverItem = helpers.getParentByClass(this._$wrapper, 'hover-box__item--show-on-hover');
            hoverItem && hoverItem.classList.remove(SelectItemsClass.FOCUSED);

            const postItem = helpers.getParentByClass(this._$wrapper, 'project-product');
            if (postItem) {
                postItem.style.zIndex = "";
                postItem.classList.remove('js-dropdown-opened');
            }

            // CLOSE
            this._$wrapper.classList.remove(SelectItemsClass.OPTIONS_IS_OPEN);
            hoverItem && hoverItem.classList.remove(SelectItemsClass.FOCUSED);
            this._isOpened = false;

            Select.activeSelect = null;

            if (postItem) {
                postItem.style.zIndex = "";
                postItem.classList.remove('js-dropdown-opened');
            }

            //
            if (this._$options && this._$options.classList.contains('project-select__options--fixed')) {
                this._$options.style.display = '';
            }

            document.removeEventListener('click', this.closeView);
        }

    }

    closeView() {
        this.isOpen = false;
    }
}
