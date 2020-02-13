/**
 * App
 * Головний файл аплікації
 */

// Dependencies
import helpers from './helpers';
import eventSubscriber from './lib/Observer/EventSubscriber';

import ModuleLoader, { DynamicModulesList } from './lib/ModuleLoader/index';
import { ClickBehaviourHelper } from './Helpers/ClickBehaviourHelper';
import ShowInViewport from './Components/ShowInViewport';

export enum AppActions {
    UPDATE_STICKY_ON_SCROLL = 'update-sticky-on-scroll',
    UPDATE_STICKY_ASIDE_POSITION = 'update-sticky-aside-position',

    MORE_TEXT_RESIZE = 'moreTextResize',

    DRAW_STATUS_LINE = 'drawStatusLine',

    ON_RESIZE = 'resize',
    ON_SCROLL = 'scroll',
    ON_DOCUMENT_CLICK = 'click',

    UPDATE_CUSTOM_SCROLL = 'update-custom - scroll',

    INIT_CUSTOM_SCROLL = 'init-custom-scroll',

    INIT_SELECT = 'init-select',
    INIT_DROPDOWN = 'init-dropdown',

    INIT_MODAL_CLICK = 'init-modal-click',

    UPDATE_BLOG_POST_CAROUSEL = 'update-blog-post-carousel'

}

// TODO: delete afte testing
declare const collectionType: string;

declare let __webpack_require__: any;

// TODO: move to helpres
function setScreenVhHeight() {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

interface IApp {
    init(): void;
    onDocumentClick(e: MouseEvent): void;
    onDocumentReady(): void;
    onWindowLoad(): void;
    onWindowResize(): void;
    onScroll(): void;
}

interface IAppState {
    docState: boolean;
}

/**
 * App singleton
 */
class App implements IApp {
    static instance: App;

    private _state: IAppState = {
        docState: false,
    };

    constructor() {
        if (!App.instance) {
            App.instance = this;
        }

        return App.instance;
    }

    init() { }

    onDocumentClick(e: MouseEvent) {
        /**
         * CLICK EVENT
         */

        // Close search result
        eventSubscriber.dispatch(AppActions.ON_DOCUMENT_CLICK);
    }

    onDocumentReady() {
        this._state.docState = true;

        // Головний конфіг теми
        // Описаний в index.d.ts
        const projectConfig = Object.freeze(
            JSON.parse(JSON.stringify(window.projectConfig || {}))
        ) as ProjectConfig;

        // Set jsPath for dynamic module
        if (projectConfig.assets) {
            __webpack_require__.p = projectConfig.assets + 'js/';
        }

        // ===========================================================
        // ======================== DropDown ========================
        // ===========================================================
        
        document.querySelectorAll<HTMLElement>('.project-dropDown:not(.project-dropDown--inited)')
            .forEach($item => {
                import('./Components/DropDown')
                    .then(module => {
                        new module.default({ wrapper: $item });
                    });
            });

        eventSubscriber.add(AppActions.INIT_DROPDOWN, () => {
            document.querySelectorAll<HTMLElement>('.project-dropDown:not(.project-dropDown--inited)')
                .forEach($item => {
                    import('./Components/DropDown')
                        .then(module => {
                            new module.default({ wrapper: $item });
                        });
                });
        });
        // ===========================================================
        // ===========================================================

        // ===========================================================
        // ======================== Video ========================
        // ===========================================================
        document.querySelectorAll<HTMLElement>('.project-video:not(.project-video--inited)')
        .forEach(video => {
            video.classList.add('project-video--inited');

            const clickEvent = (e: Event) => {
                video.classList.add('project-video--show');

                video.removeEventListener<'click'>('click', clickEvent);    
            };

            video.addEventListener<'click'>('click', clickEvent);
        });
        // ===========================================================
        // ===========================================================


        // ===========================================================
        // ======================== Go to ========================
        // ===========================================================
        document.querySelectorAll<HTMLElement>('[data-goTo]')
            .forEach(el => {
                el.addEventListener<'click'>('click', e => {
                    e.preventDefault();
                    const destination = el.dataset.goto;
                    if (destination) {
                        ClickBehaviourHelper.goTo(destination);
                    }
                });
            });
        // ===========================================================
        // ===========================================================

        // ===========================================================
        // ================= Store Product Container =================
        // ===========================================================
        import('./theme/Components/StoreProduct')
            .then(module => {
                module.StoreProductContainer.init();
            });
        // ===========================================================
        // ===========================================================

        document.querySelectorAll<HTMLElement>('[data-program-click]')
            .forEach(el => {
                el.addEventListener<'click'>('click', e => {
                    e.preventDefault();
                    const elData = el.dataset.programClick;
                    console.log(elData);
                    if (elData) {
                        ClickBehaviourHelper.programClick(elData.split(','));
                    }
                });
            });

        document.querySelectorAll<HTMLElement>('[data-goTo]')
            .forEach(el => {
                el.addEventListener<'click'>('click', e => {
                    e.preventDefault();
                    const destination = el.dataset.goto;
                    if (destination) {
                        ClickBehaviourHelper.goTo(destination);
                    }
                });
            });

        setScreenVhHeight();
        eventSubscriber.add(AppActions.ON_RESIZE, setScreenVhHeight);

        // Add delay to all list with this class
        helpers.itemsAnimDelay(document.querySelectorAll('.js-add-animation-delay'));

        /**
         * SELECT
         * TODO: need refactoring
         */
        document.querySelectorAll<HTMLSelectElement>(
            '.project-select:not(.project-select--inited)'
        ).forEach(wrapper => {
            import('./Components/Select')
                .then(module => {
                    new module.default({ wrapper });
                });
        });

        eventSubscriber.add(AppActions.INIT_SELECT, () => {
            document.querySelectorAll<HTMLSelectElement>(
                '.project-select:not(.project-select--inited)'
            ).forEach(wrapper => {
                import('./Components/Select')
                    .then(module => {
                        new module.default({ wrapper });
                    });
            });
        });

        // Blog Post Carousel
        const blogPostCarousels = document.querySelectorAll<HTMLElement>(
            '.project-post-carousel-wrapper'
        );
        if (blogPostCarousels.length > 0) {
            ModuleLoader.load<any>({ name: DynamicModulesList.BLOG_POST_CAROUSEL }).then(
                module => {
                    blogPostCarousels.forEach(wrapper => {
                        const carousel = new module.BlogPostCarousel({
                            el: wrapper,
                            showStatusLine: !wrapper.classList.contains(
                                'project-post-carousel-wrapper--no-line'
                            ),
                            showControls: !wrapper.classList.contains(
                                'project-post-carousel-wrapper--no-controls'
                            ),
                        });

                        eventSubscriber.add(AppActions.UPDATE_BLOG_POST_CAROUSEL, () => {
                            carousel.updateView();
                        });

                    });
                }
            );
        }

        // ===========================================================
        // ======================= Carousel ==========================
        // ===========================================================
        const productSliders = document.querySelectorAll('.project-tns-slider-wrapper');
        if (productSliders) {
            productSliders.forEach(sliderWrapper => {
                const slider = sliderWrapper.querySelector<HTMLElement>('.project-tns-slider');
                const thumbs = sliderWrapper.querySelector<HTMLElement>('.project-tns-slider__thumbnails-list');

                
                if (slider) {
                    const isProductSlider = slider.classList.contains('project-tns-slider--product');
                    const items = slider?.dataset.items;
                    import('./Components/TumliSlider')
                        .then(module => {
                            new module.TumliSlider({
                                container: slider,
                                items: isProductSlider ? 1 : 5,
                                // slideBy: 'page',
                                navAsThumbnails: true,
                                navContainer: thumbs || false,
                                speed: 400,
                                mouseDrag: true,
                                nav: !!thumbs,
                                controls: true,
                                controlsText: [
                                    `<svg width="11px" height="17px">
                                    <path fill-rule="evenodd" fill="currentColor"
                                        d="M9.924,1.988 L3.414,8.499 L9.924,15.009 C10.315,15.400 10.315,16.033 9.924,16.424 C9.534,16.814 8.901,16.814 8.510,16.424 L1.800,9.713 C1.538,9.718 1.275,9.624 1.075,9.424 C0.823,9.172 0.752,8.822 0.825,8.499 C0.752,8.175 0.823,7.826 1.075,7.574 C1.275,7.374 1.538,7.280 1.799,7.285 L8.510,0.574 C8.901,0.184 9.534,0.184 9.924,0.574 C10.315,0.965 10.315,1.598 9.924,1.988 Z" />
                                    </svg>`,
                                    `<svg width="11px" height="17px">
                                    <path fill-rule="evenodd" fill="currentColor"
                                        d="M9.924,9.423 C9.725,9.623 9.462,9.717 9.200,9.713 L2.489,16.423 C2.099,16.814 1.466,16.814 1.075,16.423 C0.685,16.033 0.685,15.400 1.075,15.009 L7.586,8.499 L1.075,1.988 C0.685,1.598 0.685,0.965 1.075,0.574 C1.466,0.183 2.099,0.183 2.489,0.574 L9.200,7.285 C9.461,7.280 9.724,7.374 9.924,7.574 C10.176,7.826 10.248,8.175 10.175,8.499 C10.248,8.822 10.176,9.172 9.924,9.423 Z" />
                                    </svg>` 
                                    
                                ],
                                gutter: 30,
                                responsive: isProductSlider ? {
                                    0: {
                                        items: 1
                                    }
                                } : {
                                    992: {
                                        items: 5
                                    },
                                    768: {
                                        items: 3
                                    },
                                    0: {
                                        items: 1
                                    }
                                }
                                // autoplay: true
                            });
                        });
                }
                else {
                    console.error(new Error('Slider on nav ot founed: '), sliderWrapper);
                }
            });
        }
        // ===========================================================
        // ===========================================================

        // else {
        /**
         * Show In View Port
         */
        const productsSHowInView = Array.from(document.querySelectorAll(
            '.project-product:not(.project-carousel__item)'
        ) as NodeListOf<HTMLElement>);
        if (productsSHowInView.length > 0) {
            ModuleLoader.load<any>({ name: DynamicModulesList.SHOW_IN_VIEWPORT }).then(
                showInViewport => {
                    return new showInViewport.default({
                        elems: productsSHowInView,
                        scroll: document,
                        showCallback: () => { },
                    });
                }
            );
        }
        // }

        const products = Array.from(document.querySelectorAll(
            '.project-product'
        ) as NodeListOf<HTMLElement>);
        if (products.length > 0) {
            ModuleLoader.load<any>({ name: DynamicModulesList.SHOW_IN_VIEWPORT }).then(
                showInViewport => {
                    return new showInViewport.default({
                        elems: products,
                        scroll: document,
                        showCallback: () => { },
                    });
                }
            );
            ModuleLoader.load<any>({ name: DynamicModulesList.SHOW_IN_VIEWPORT }).then(
                showInViewport => {
                    return new showInViewport.default({
                        elems: products,
                        scroll: document,
                        showCallback: () => { },
                    });
                }
            );
            ModuleLoader.load<any>({ name: DynamicModulesList.SHOW_IN_VIEWPORT }).then(
                showInViewport => {
                    return new showInViewport.default({
                        elems: products,
                        scroll: document,
                        showCallback: () => { },
                    });
                }
            );

            setTimeout(() => {
                ModuleLoader.load<any>({ name: DynamicModulesList.SHOW_IN_VIEWPORT }).then(
                    showInViewport => {
                        return new showInViewport.default({
                            elems: products,
                            scroll: document,
                            showCallback: () => { },
                        });
                    }
                );
            }, 5000);
        }

        // Init More text
        const moreText = Array.from(document.querySelectorAll(
            '.project-more-text'
        ) as NodeListOf<HTMLElement>);
        if (moreText.length > 0) {
            import('./Components/MoreText').then(module => {
                moreText.forEach(el => {
                    // Add 'More text' to manager
                    // It call on resize event
                    module.default.add(el);
                });

                eventSubscriber.add(AppActions.ON_RESIZE, () => {
                    module.default.moreTextInstances.forEach(moreText =>
                        moreText.onResize()
                    );
                });
            });
        }

        // Init scroll top
        const scrollTop = document.querySelector('.project-header__scroll-top a');
        if (scrollTop) {
            import('./Components/SmoothAnchor').then(module => {
                // Init smooth sroll
                const smooth = new module.default({
                    scroll: document,
                });

                scrollTop.addEventListener('click', (e: Event) => {
                    e.preventDefault();
                    smooth.scrollTo(document.body);
                });
            });
        }

        // Add sides
        const topHeader = document.querySelector('.project-header') as HTMLElement;
        if (topHeader) {
            // Init fix on scroll
            const stickyDesktop = Array.from(document.querySelectorAll(
                '.project-sticky-block'
            ) as NodeListOf<HTMLElement>);

            const stickyAsideElems = Array.from(document.querySelectorAll(
                '.project-asides-block__aside--sticky'
            ) as NodeListOf<HTMLElement>);

            const stickyElems = Array.from([...stickyDesktop, ...stickyAsideElems]);

            if (stickyElems.length > 0) {
                import('./Components/StickyAside').then(module => {
                    stickyElems.forEach(el => {
                        module.default.add({
                            el,
                            topHeader,
                            fixBlockAfterHide: el.classList.contains(
                                'project-sticky-block--fix-after-hide'
                            ),
                            onUnfixCallback: () => {
                                // Your code
                            },
                        });

                        eventSubscriber.add(
                            AppActions.UPDATE_STICKY_ON_SCROLL,
                            (scrollTop: number) => {
                                module.default.onScroll(scrollTop);
                            }
                        );

                        eventSubscriber.add(
                            AppActions.UPDATE_STICKY_ASIDE_POSITION,
                            (scrollTop: number) => {
                                module.default.onResize(scrollTop);
                            }
                        );

                        eventSubscriber.add(AppActions.ON_RESIZE, (scrollTop: number) => {
                            module.default.onResize(scrollTop);
                        });

                        eventSubscriber.dispatch(
                            AppActions.UPDATE_STICKY_ON_SCROLL,
                            helpers.getScrollState(document).scrollTop
                        );

                    });
                });
            }
        }

        // INIT ACCORDION
        const accordions = document.querySelectorAll('.project-accordion--js:not(.project-accordion--inited)');
        if (accordions.length > 0) {
            ModuleLoader.load<any>({ name: DynamicModulesList.ACCORDION }).then(module => {
                accordions.forEach(accordion => {
                    new module.Accordion({
                        accordion,
                    });
                });
            });
        }

        // INIT TABS
        const tabs = Array.from(document.querySelectorAll(
            '.tabs:not(.tabs--inited)'
        ) as NodeListOf<HTMLElement>);
        if (tabs.length > 0) {
            ModuleLoader.load<any>({ name: DynamicModulesList.TAB }).then(module => {
                tabs.forEach(tab => {
                    new module.Tab({
                        tab,
                        onChange: () => {
                            eventSubscriber.dispatch(AppActions.UPDATE_BLOG_POST_CAROUSEL);
                            eventSubscriber.dispatch(AppActions.UPDATE_STICKY_ASIDE_POSITION);
                        }
                    });
                });
            });
        }

        setTimeout(() => {
            // Show document
            requestAnimationFrame(() => {
                document.body.classList.add('document-loaded');
            });
        }, 200);
    }

    onWindowLoad() {
        // Your code
    }

    onWindowResize() {
        eventSubscriber.dispatch(AppActions.MORE_TEXT_RESIZE);

        eventSubscriber.dispatch(
            AppActions.ON_RESIZE,
            helpers.getScrollState(document).scrollTop
        );
    }

    onScroll() {
        /**
         * SCROLL EVENT
         */

        const scrollState = helpers.getScrollState(document);
        const scrollTop = scrollState.scrollTop;

        eventSubscriber.dispatch(AppActions.DRAW_STATUS_LINE, scrollState);
        eventSubscriber.dispatch(AppActions.UPDATE_STICKY_ON_SCROLL, scrollTop);

        eventSubscriber.dispatch(AppActions.ON_SCROLL);
    }
}

export default App;
