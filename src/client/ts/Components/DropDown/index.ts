import helpers from "../../helpers";

export interface IClickableItem {
    close(): void;
}

export class ClickableItemStore {
    static _items: IClickableItem[] = [];

    static add(item: IClickableItem) {
        ClickableItemStore._items.push(item);
    }

    static close() {
        ClickableItemStore._items.forEach(item => item.close());
        ClickableItemStore._items = [];
    }
}

class DropDown {
    private _$wrapper: HTMLElement;

    constructor(config: { wrapper: HTMLElement }) {
        this._$wrapper = config.wrapper;

        this._$wrapper.querySelectorAll<HTMLElement>('.project-dropDown__show-on-focused').forEach($item => {
            $item.addEventListener<'focus'>('focus', e => {
                this._$wrapper.classList.add('project-dropDown--focused');
            });

            $item.addEventListener<'blur'>('blur', e => {
                this._$wrapper.classList.remove('project-dropDown--focused');
            });
        });

        if (this._$wrapper.classList.contains('project-dropDown--js-click')) {
            const $title = this._$wrapper.querySelector<HTMLElement>('.project-dropDown__title');

            if ($title) {
                $title.addEventListener<'click'>('click', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    

                    if (!this._$wrapper.classList.contains('project-dropDown--focused')) {
                        

                        ClickableItemStore.close();


                        
                        this.open();
                    }
                    else {
                        this.close();
                        ClickableItemStore.close();
                    }

                    
                });
            }

            const $content = this._$wrapper.querySelector<HTMLElement>('.project-dropDown__list-wrapper');
            if ($content) {
                $content.addEventListener<'click'>('click', e => {
                    e.stopPropagation();
                });
            }
        }
    }

    open() {
        this._$wrapper.classList.add('project-dropDown--focused');
        const hoverItem = helpers.getParentByClass(this._$wrapper, 'hover-box__item--show-on-hover');
        hoverItem && hoverItem.classList.add('hover-box--focused');
        document.addEventListener<'click'>('click', this.close);
        ClickableItemStore.add(this);

        const postItem = helpers.getParentByClass(this._$wrapper, 'project-product');
        if (postItem) {
            postItem.style.zIndex = "2";
            postItem.classList.add('js-dropdown-opened');
        }
    }

    close = () => {
        this._$wrapper.classList.remove('project-dropDown--focused');
        const hoverItem = helpers.getParentByClass(this._$wrapper, 'hover-box__item--show-on-hover');
        hoverItem && hoverItem.classList.remove('hover-box--focused');
        document.removeEventListener<'click'>('click', this.close);

        const postItem = helpers.getParentByClass(this._$wrapper, 'project-product');
        if (postItem) {
            postItem.style.zIndex = "";
            postItem.classList.remove('js-dropdown-opened');
        }
    }

}

export default DropDown;
