import helpers from "../../helpers";

/*
 * Tumli carousel
 */

interface ITumliCarousel {
    next(): void;
    prev(): void;
}

interface ICarouselSettings {
    carouselNode: HTMLDivElement;
    itemSelector?: string;
    activeItems?: number[];
    afterChange?: (item: HTMLElement) => void;
    afterInit?: (item: HTMLElement) => void;
}

enum TumliCarouselClasses {
    ITEM = 'project-carousel__item',
    SINGLE_ITEM = 'project-carousel--single-item',
    MOVE_ON_HOVER = 'project-carousel--move-on-hover',
    ACTIVE_ITEM = 'project-carousel__item--active',
    PREV = 'project-carousel__nav-prev',
    NEXT = 'project-carousel__nav-next',
}

export class TumliCarousel implements ITumliCarousel {
    private _settings: ICarouselSettings;
    private _carousel: HTMLDivElement;
    private _list: HTMLDivElement[];
    private _currentItems: number[] = [];
    private _timeout = 0;
    private _animationDuration = 600;

    constructor(settings: ICarouselSettings) {
        this._settings = settings;
        this._carousel = settings.carouselNode;
        const dataset = this._carousel.dataset;
        this._list = Array.from(
            this._carousel.querySelectorAll(
                settings.itemSelector ||
                dataset.itemSelector ||
                `.${TumliCarouselClasses.ITEM}`
            )
        );

        const length = this._list.length;

        if (length === 1) {
            this._carousel.classList.add(TumliCarouselClasses.SINGLE_ITEM);
            this._list[0].classList.add(TumliCarouselClasses.ACTIVE_ITEM);
            this._list[0].classList.add(`${TumliCarouselClasses.ITEM}--0`);
            if (typeof this._settings.afterInit === 'function') {
                this._settings.afterInit(this._carousel);
            }
        }

        else if (length > 1) {
            this._currentItems = [length - 1, length - 2, length - 3];

            if (length === 2) {
                this._currentItems = [length - 1, length - 2];
            }

            this._list.forEach((item: HTMLElement) =>
                item.classList.add(TumliCarouselClasses.ITEM)
            );

            this._seActive(this._currentItems, true);

            const prevBtn = this._carousel.querySelector(
                `.${TumliCarouselClasses.PREV}`
            );
            const nextBtn = this._carousel.querySelector(
                `.${TumliCarouselClasses.NEXT}`
            );

            prevBtn && prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prev();
            });
            nextBtn && nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.next();
            });

            if (typeof this._settings.afterInit === 'function') {
                this._settings.afterInit(this._carousel);
            }

            // TODO: move to method
            if (this._carousel.classList.contains(TumliCarouselClasses.MOVE_ON_HOVER)) {

                let el: HTMLElement | null = null;
                const parentSelector = this._carousel.dataset.parentHoverSelector;
                if (parentSelector) {
                    el = helpers.getParentByClass(this._carousel, parentSelector);
                }

                if (!el) {
                    el = this._carousel as HTMLElement;
                }


                let isLoop = false;
                let timer;
                const loop = () => {
                    // Move next
                    this.next();
                    
                    timer = setTimeout(() => {
                        // loop
                        loop();
                    }, 1600);
                };

                el.addEventListener<'mouseenter'>('mouseenter', e => {
                    if (!isLoop) {
                        isLoop = true;
                        loop();
                    }
                });

                el.addEventListener<'mouseleave'>('mouseleave', e => {
                    clearTimeout(timer);
                    isLoop = false;
                });
            }
        }

        this._carousel.classList.add('project-carousel--loaded');
    }

    private _seActive(indexArray: number[], next: boolean) {
        // Clear list
        this._list.forEach(item => {
            if (item.classList.contains(TumliCarouselClasses.ACTIVE_ITEM)) {
                item.classList.remove(TumliCarouselClasses.ACTIVE_ITEM);
            }

            indexArray.forEach((itemIndex, index) => {
                if (item.classList.contains(`${TumliCarouselClasses.ITEM}--${index}`)) {
                    item.classList.remove(`${TumliCarouselClasses.ITEM}--${index}`);
                }
            });
        });

        this._currentItems = indexArray
            .map((itemIndex: number, index: number) => {
                if (this._list[itemIndex]) {
                    this._list[itemIndex].classList.add(
                        `${TumliCarouselClasses.ITEM}--${index}`
                    );
                }

                return itemIndex;
            })
            .slice();

        this._list[this._currentItems[0]].classList.add(
            TumliCarouselClasses.ACTIVE_ITEM
        );

        if (typeof this._settings.afterChange === 'function') {
            clearTimeout(this._timeout);
            const self = this;
            const afterChange = this._settings.afterChange;

            this._timeout = window.setTimeout(() => {
                afterChange(self._list[self._currentItems[0]]);
            }, this._animationDuration);
        }
    }

    prev(): void {
        const indexArray = this._currentItems.map((item: number) => {
            let index = item + 1;
            if (index >= this._list.length) {
                index = 0;
            }
            return index;
        });

        this._seActive(indexArray, false);
    }

    next(): void {
        const indexArray = this._currentItems.map((item: number) => {
            let index = item - 1;
            if (index < 0) {
                index = this._list.length - 1;
            }
            return index;
        });

        this._seActive(indexArray, true);
    }
}
