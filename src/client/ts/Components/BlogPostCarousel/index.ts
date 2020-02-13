/**
 * BlogPost carousel
 * v.0.0.1-beta
 * Каруселька знизу поста
 * Працює як простий горизонтальний скрол.
 * Сам скрол ховається
 * Додається можливість перетаскувати(скролити) мишкою
 */

//import './_blogPostCarousel.scss';
import helpers from '../../helpers';
import ModuleLoader, { DynamicModulesList } from '../../lib/ModuleLoader/index';
import SmoothAnchor from '../SmoothAnchor';

interface IBlogPostCarousel {
    el: HTMLElement; // Wrapper
    showStatusLine: boolean;
    showControls: boolean;
}

interface IBlogPostCarouselState {
    items: {
        currentX: number;
    };
    scroll: {
        currentX: number;
    };
    isLineMove: boolean;
    isMouseMove: boolean;
    isMouseDown: boolean;
}

export class BlogPostCarousel {
    private static SCROLL_WIDTH = 150;
    private static ITEM_MARGIN = 30;
    private static ITEMS_COUNT = 3;

    private config: IBlogPostCarousel;
    private scroll: HTMLElement | null = null;

    private element: HTMLElement | null;
    private parent: HTMLElement;
    private _itemsWrapper: HTMLElement | null = null;

    private _scrollBtnWrapper: HTMLElement | null = null;
    private _scrollNextBtn: HTMLElement | null = null;
    private _scrollPrevBtn: HTMLElement | null = null;

    private state: IBlogPostCarouselState = {
        items: {
            currentX: 0,
        },
        scroll: {
            currentX: 0,
        },
        isLineMove: false,
        isMouseMove: false,
        isMouseDown: false,
    };

    private _statusLine: {
        draw: (obj: {
            scrollTop: number;
            scrollHeight: number;
            height: number;
        }) => void;
    } | null = null;

    constructor(config: IBlogPostCarousel) {
        this.config = Object.assign({ showControls: true }, config);

        this.element = this.config.el.querySelector('.project-post-carousel');
        this.parent = this.config.el.parentNode as HTMLElement;

        if (this.element) {
            const itemsWrapper = this.element.querySelector(
                '.project-post-carousel__items'
            ) as HTMLElement;

            if (itemsWrapper) {
                this._itemsWrapper = itemsWrapper;
                const itemsCount = itemsWrapper.dataset.itemsCount || 3;

                const items = itemsWrapper.children;
                if (itemsWrapper && items.length > itemsCount) {
                    itemsWrapper.classList.add('box-model-default-r');
                    itemsWrapper.classList.add('project-post-carousel__items--show-after');
                }
            }

            this.parent.classList.add('project-carousel--loaded');
        }

        if (this.config.showStatusLine) {
            this.scroll = this.addScroll();
        }

        // Init StatusScrollLine
        if (this.scroll) {
            ModuleLoader.load<any>({ name: DynamicModulesList.SCROLL_STATUS_LINE }).then(
                module => {
                    this._statusLine = new module.ScrollStatusLine({
                        elem: this.scroll as HTMLElement,
                    });
                }
            );
        }

        this.initWrapperScroll();
        // this.initScrollMove();
        this.initMouseMove();

        if (this.config.showControls) {
            this._scrollBtnWrapper = this.parent.querySelector('.project-carousel__nav-wrapper');

            if (!this._scrollBtnWrapper) {
                this.createButtonWrapper();
                this.createRightButton();
                this.createLeftButton();
            }
            else {
                this._scrollNextBtn = this._scrollBtnWrapper.querySelector('.project-carousel__nav-next');
                if (this._scrollNextBtn) {
                    this.createRightButton(this._scrollNextBtn);
                }

                this._scrollPrevBtn = this._scrollBtnWrapper.querySelector('.project-carousel__nav-prev');
                if (this._scrollPrevBtn) {
                    this.createLeftButton(this._scrollPrevBtn);
                }
            }
        }

    }

    private _drawLineOnScroll(scrollLeft, scrollWidth, height) {
        if (this._statusLine) {
            this._statusLine.draw({
                scrollTop: scrollLeft,
                scrollHeight: scrollWidth,
                height,
            });
        }
    }

    // Check if wrapper is scrolling
    hasScroll(): boolean {
        return this.config.el.scrollWidth > this.config.el.clientWidth;
    }

    isScrolled(): boolean {
        return this.config.el.scrollLeft > 0;
    }

    private _animateScroll(startPos: number, left: number) {
        SmoothAnchor._animate({
            duration: 200,
            timing: (timeFraction: any) => {
                return timeFraction;
            },
            draw: (progress: any) => {
                progress = progress < 0 ? 0 : progress;
                if (!this.state.isMouseDown) {
                    this.config.el.scrollLeft = startPos + left * progress;
                }
            },
        });
    }

    createButtonWrapper() {
        const wrapper = helpers.createNode('div').attr({
            class:
                'project-carousel__nav-wrapper project-container hover-box__item--show-on-hover',
        });

        this._scrollBtnWrapper = wrapper.getNode();

        const parent = this.config.el.parentNode as HTMLElement;

        if (parent) {
            const nav = parent.querySelector('.project-carousel__nav-wrapper');

            this._scrollBtnWrapper = wrapper.getNode();
            parent.classList.add('u-relative');
            parent.classList.add('hover-box');

            if (nav) {
                parent.replaceChild(wrapper.getNode(), nav);
            } else {
                parent.appendChild(wrapper.getNode());
            }
        }
    }

    createLeftButton(el?: HTMLElement) {
        let btn;

        if (el) {
            btn = helpers
                .node(el)
        }
        else {
            btn = helpers
                .createNode('div')
                .attr({
                    class:
                        'project-carousel__nav-prev project-carousel__nav-prev--left project-carousel__nav-prev--style-1 cursor-pinter',
                })
                .innerHtml(
                    `
                        <svg class="absolute-centered" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"></path></svg>
                    `
                )
        }

        btn.event('click', e => {
            e.preventDefault();

            const itemsWrapper = this._itemsWrapper;
            // Scroll left
            if (itemsWrapper) {
                const scrollLeft = this.config.el.scrollLeft;
                const left = -itemsWrapper.clientWidth;

                this._animateScroll(scrollLeft, left);
            }
        });

        if (this._scrollBtnWrapper) {
            this._scrollPrevBtn = btn.getNode();
            if (!this.hasScroll() && this._scrollPrevBtn) {
                this._scrollPrevBtn.classList.add(
                    'project-carousel__nav-prev--hide'
                );

                if(el) {

                }
                else {
                    this._scrollBtnWrapper.appendChild(this._scrollPrevBtn);
                }
                
            }
        }
    }

    createRightButton(el?: HTMLElement) {
        let btn;

        if (el) {
            btn = helpers
                .node(el)
        }
        else {
            btn = helpers
                .createNode('div')
                .attr({
                    class:
                        'project-carousel__nav-next project-carousel__nav-next--right project-carousel__nav-next--style-1 cursor-pointer',
                })
                .innerHtml(
                    `
                            <svg class="absolute-centered" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                                <g transform="translate(12.000000, 12.000000) scale(-1, 1) translate(-12.000000, -12.000000) ">
                                    <polygon points="15.41 7.41 14 6 8 12 14 18 15.41 16.59 10.83 12"></polygon>
                                </g>
                            </svg>
                        `
                )
        }

        btn.event('click', e => {
            e.preventDefault();
            e.stopPropagation();

            const itemsWrapper = this._itemsWrapper;
            // Scroll left
            if (itemsWrapper) {
                const scrollLeft = this.config.el.scrollLeft;
                const left =
                    itemsWrapper.clientWidth *
                    (Math.floor(scrollLeft / itemsWrapper.clientWidth) + 1) -
                    scrollLeft;

                this._animateScroll(scrollLeft, left);
            }
        });

        if (this._scrollBtnWrapper) {
            this._scrollNextBtn = btn.getNode();
            if (!this.hasScroll() && this._scrollNextBtn) {
                this._scrollNextBtn.classList.add(
                    'project-carousel__nav-next--hide'
                );
            }
            
            if(el) {

            }
            else {
                this._scrollBtnWrapper.appendChild(btn.getNode());
            }
            
        }
    }

    updateView() {
        if (this._itemsWrapper) {
            if (this.hasScroll()) {
                this._itemsWrapper.classList.add(
                    'project-post-carousel__items--show-after'
                );
            } else {
                this._itemsWrapper.classList.remove(
                    'project-post-carousel__items--show-after'
                );
            }
        }

        if (this._scrollNextBtn) {
            if (this.state.scroll.currentX >= this.config.el.scrollWidth) {
                this._scrollNextBtn.classList.add(
                    'project-carousel__nav-next--hide'
                );
            } else {
                this._scrollNextBtn.classList.remove(
                    'project-carousel__nav-next--hide'
                );
            }
        }

        if (this._scrollPrevBtn) {
            if (this.state.scroll.currentX > 0) {
                this._scrollPrevBtn.classList.remove(
                    'project-carousel__nav-prev--hide'
                );
            } else {
                this._scrollPrevBtn.classList.add(
                    'project-carousel__nav-prev--hide'
                );
            }
        }
    }

    /**
     * Update scroll position
     * @param currentX - must be > 0 & < wrapper width
     * @param extend - custom style 'width: auto; color: green;'
     */
    updateScrollPosition(currentX: number, extend = '') {
        let x = currentX || 0;

        if (x < 0) {
            x = 0;
        }

        if (this.scroll) {
            const parent = this.scroll.parentNode as HTMLElement;
            const parentWidth = parent.clientWidth - BlogPostCarousel.SCROLL_WIDTH;

            if (x > parentWidth) {
                x = parentWidth;
            }

            this.scroll.style.cssText = `
        transform: translate3d(${x}px, 0, 0);
        ${extend}
      `;
        }
    }

    getItemsWidth(elWidth, itemsCount) {
        let marginCount = 0;

        if (window.innerWidth >= 992) {
            BlogPostCarousel.ITEMS_COUNT = 3;
            marginCount = 2;
        } else if (window.innerWidth >= 768) {
            BlogPostCarousel.ITEMS_COUNT = 2;
            marginCount = 1;
        } else {
            BlogPostCarousel.ITEMS_COUNT = 1;
        }

        return (
            ((elWidth - BlogPostCarousel.ITEM_MARGIN * marginCount) /
                BlogPostCarousel.ITEMS_COUNT) *
            itemsCount +
            BlogPostCarousel.ITEM_MARGIN * (itemsCount - 1) -
            elWidth
        );
    }

    calculateScrollPos(currentX) {
        if (currentX > 0) {
            return 0;
        }

        const elWidth = this.config.el.clientWidth;
        const itemsCount = this.config.el.children.length;
        const itemsWidth = this.getItemsWidth(elWidth, itemsCount);

        const precent = currentX / itemsWidth;

        let pos = (elWidth - BlogPostCarousel.SCROLL_WIDTH) * precent * -1;

        if (pos > elWidth - BlogPostCarousel.SCROLL_WIDTH) {
            pos = elWidth - BlogPostCarousel.SCROLL_WIDTH;
        }

        this.state.scroll.currentX = pos;

        return pos;
    }

    /**
     * Add move on mouse or touch event
     */
    initMouseMove() {
        // TODO 1

        // if (!this.checkScroll()) {
        //   return;
        // }

        const el = this.config.el.parentNode as HTMLElement;
        let isDown = false;
        let startX = 0;
        let endX = 0;

        const onStart = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();

            this.state.isMouseDown = true;
            isDown = true;
            this.state.scroll.currentX = this.config.el.scrollLeft;

            if (e.type === 'mousedown') {
                startX = endX = (e as MouseEvent).clientX;
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onEnd);
            } else if (e.type === 'touchstart') {
                startX = endX = (e as TouchEvent).touches[0].clientX;
                document.addEventListener('touchmove', onMove);
                document.addEventListener('touchend', onEnd);
            }
        };

        const onMove = (e: MouseEvent | TouchEvent) => {
            if (!isDown) {
                return;
            }

            this.state.isMouseMove = true;

            this.config.el.classList.add('--moving');

            if (e.type === 'mousemove') {
                endX = (e as MouseEvent).clientX;
            } else if (e.type === 'touchmove') {
                endX = (e as TouchEvent).touches[0].clientX;
            }

            const delta = startX - endX;
            this.config.el.scrollLeft = this.state.scroll.currentX + delta;
        };

        const onEnd = (e: MouseEvent | TouchEvent) => {
            this.state.isLineMove = false;
            this.state.isMouseMove = false;

            this.state.isMouseDown = false;
            isDown = false;
            this.state.scroll.currentX += startX - endX;

            this.config.el.classList.remove('--moving');

            if (e.type === 'mouseup') {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onEnd);
            } else if (e.type === 'touchend') {
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('touchend', onEnd);
            }
        };

        if ('onmousedown' in document.documentElement) {
            el.addEventListener('mousedown', onStart);
        }
    }

    /**
     * Ініціалізує можливість пересовувати лінію з допомогою миші
     * Наразі не використовується
     */
    initScrollMove(): void {
        if (!this.hasScroll()) {
            return;
        }

        const scroll = this.scroll as HTMLElement;

        let isDown = false;
        let startX = 0;
        let endX = 0;

        if (!scroll) {
            return;
        }

        const onStart = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            e.stopPropagation();

            isDown = true;

            this.state.scroll.currentX = this.calculateLinePosRelativeToScroll(
                this.config.el.scrollLeft
            );

            if ('ontouchstart' in document.documentElement) {
                startX = endX = (e as TouchEvent).touches[0].clientX;
                document.addEventListener('touchmove', onMove);
                document.addEventListener('touchend', onEnd);
            } else {
                startX = endX = (e as MouseEvent).clientX;
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onEnd);
            }
        };

        const onMove = (e: MouseEvent | TouchEvent) => {
            if (!isDown) {
                return;
            }

            this.state.isLineMove = true;
            this.state.isMouseMove = true;

            if ('ontouchstart' in document.documentElement) {
                endX = (e as TouchEvent).touches[0].clientX;
            } else {
                endX = (e as MouseEvent).clientX;
            }

            const delta = startX - endX;

            this.config.el.classList.add('--moving');
            this.updateScrollPosition(this.state.scroll.currentX - delta);
            this.updateScroll(
                this.calculateScrollRelativeToLine(this.state.scroll.currentX - delta)
            );
        };

        const onEnd = (e: MouseEvent | TouchEvent) => {
            this.state.isLineMove = false;
            this.state.isMouseMove = false;
            isDown = false;

            if (this.state.scroll.currentX < 0) {
                this.state.scroll.currentX = 0;
            } else if (
                this.state.scroll.currentX >
                this.config.el.clientWidth - BlogPostCarousel.SCROLL_WIDTH
            ) {
                this.state.scroll.currentX =
                    this.config.el.clientWidth - BlogPostCarousel.SCROLL_WIDTH;
            }

            this.config.el.classList.remove('--moving');

            if ('ontouchstart' in document.documentElement) {
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('touchend', onEnd);
            } else {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onEnd);
            }
        };

        if ('ontouchstart' in document.documentElement) {
            scroll.addEventListener('touchstart', onStart);
        } else {
            scroll.addEventListener('mousedown', onStart);
        }
    }

    /**
     * Вертає розташування лінії в задежності від скрола
     * @param scrollLeft - величина в пікселях на яку було проскролено
     */
    calculateLinePosRelativeToScroll(scrollLeft: number) {
        if (this.scroll) {
            const scrollWrapper = this.scroll.parentNode as HTMLElement;

            if (scrollWrapper) {
                const precent =
                    scrollLeft /
                    (this.config.el.scrollWidth - this.config.el.clientWidth);
                return (
                    (scrollWrapper.clientWidth - BlogPostCarousel.SCROLL_WIDTH) * precent
                );
            }
        }

        return scrollLeft;
    }

    /**
     * Вертає позицію скрола в залежності від позиції лінії
     * @param lineLeft - вуличина в пікселях, на яку було просунуто лінію від початкової її позиції
     */
    calculateScrollRelativeToLine(lineLeft) {
        if (this.scroll) {
            const scrollWrapper = this.scroll.parentNode as HTMLElement;

            if (scrollWrapper) {
                const precent =
                    lineLeft /
                    (scrollWrapper.clientWidth - BlogPostCarousel.SCROLL_WIDTH);
                return (
                    (this.config.el.scrollWidth - this.config.el.clientWidth) * precent
                );
            }
        }

        return lineLeft;
    }

    /**
     * Ініціалізація івента скрол на елемент
     */
    initWrapperScroll() {
        const fullScrolledWrapper = this.config.el;

        if (fullScrolledWrapper) {
            let t: any; // remove --moving class when not scrolling
            fullScrolledWrapper.addEventListener('scroll', (e: Event) => {
                if (this.state.isLineMove) {
                    return;
                }

                clearTimeout(t);
                if (!this.state.isMouseMove) {
                    this.config.el.classList.add('--moving');

                    t = setTimeout(() => {
                        this.config.el.classList.remove('--moving');
                    }, 200);
                }

                const target = e.currentTarget as HTMLElement;
                const delta = target.scrollLeft;

                this.updateScrollPosition(this.calculateLinePosRelativeToScroll(delta));
                this._drawLineOnScroll(
                    delta,
                    fullScrolledWrapper.scrollWidth,
                    fullScrolledWrapper.clientWidth
                );

                if (this._scrollNextBtn) {
                    if (
                        this.element &&
                        delta + fullScrolledWrapper.clientWidth >=
                        fullScrolledWrapper.scrollWidth
                    ) {
                        this._scrollNextBtn.classList.add(
                            'project-carousel__nav-next--hide'
                        );
                    } else {
                        this._scrollNextBtn.classList.remove(
                            'project-carousel__nav-next--hide'
                        );
                    }
                }

                if (this._scrollPrevBtn) {
                    if (delta <= 0) {
                        this._scrollPrevBtn.classList.add(
                            'project-carousel__nav-prev--hide'
                        );
                    } else {
                        this._scrollPrevBtn.classList.remove(
                            'project-carousel__nav-prev--hide'
                        );
                    }
                }
            });
        }
    }

    updateScroll(scrollLeft) {
        this.config.el.scrollLeft = scrollLeft;
    }

    /**
     * Add scroll on
     */
    addScroll(): HTMLElement | null {
        if (this.element && this.element.dataset.scroll === 'false') {
            return null;
        }

        const scroll = helpers.createNode('div').attr({
            class: 'project-post-carousel__scroll',
        });

        const scrollWrapper = helpers
            .createNode('div')
            .attr({
                class: 'project-post-carousel__scroll-wrapper',
            })
            .add(scroll.getNode());

        this.parent.insertBefore(scrollWrapper.getNode(), this.parent.firstChild);

        return scroll.getNode();
    }
}
