import helpers from '../../helpers';
// import { compose } from 'm-library';

type TLazyLoad = 'image' | 'background-image' | 'video';

/**
 * Lazy load images, backgrounds
 */
export default class LazyLoad {
    constructor(args: { elems: HTMLElement[]; type: TLazyLoad }) {
        if ('IntersectionObserver' in window) {
            this._initIntersectionObserver(args.elems, args.type);
        } else {
            this._initObserverCallback(args.elems, args.type);
        }
    }

    private _initIntersectionObserver(elems: HTMLElement[], type: TLazyLoad) {
        const lazyObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    switch (type) {
                        case 'image': {
                            lazyObserver.unobserve(
                                this._imageType(entry.target as HTMLImageElement)
                            );
                            break;
                        }
                        case 'background-image': {
                            this._backgroundType(entry.target as HTMLElement);
                            lazyObserver.unobserve(entry.target);
                            break;
                        }
                        default:
                            break;
                    }
                }
            });
        });

        elems.forEach(elem => {
            lazyObserver.observe(elem);
        });
    }

    private _initObserverCallback(elems: HTMLElement[], type: TLazyLoad) {
        let active = false;
        const lazyLoad = () => {
            if (active === false) {
                active = true;

                setTimeout(() => {
                    elems.forEach(lazyImage => {
                        if (
                            lazyImage.getBoundingClientRect().top <= window.innerHeight &&
                            lazyImage.getBoundingClientRect().bottom >= 0 &&
                            getComputedStyle(lazyImage).display !== 'none'
                        ) {
                            switch (type) {
                                case 'image': {
                                    const lazyImageElem = lazyImage as HTMLImageElement;
                                    this._imageType(lazyImageElem);
                                    break;
                                }
                                case 'background-image': {
                                    this._backgroundType(lazyImage as HTMLElement);
                                    break;
                                }
                                default:
                                    break;
                            }

                            elems = elems.filter(image => {
                                return image !== lazyImage;
                            });

                            if (elems.length === 0) {
                                document.removeEventListener('scroll', lazyLoad);
                                window.removeEventListener('resize', lazyLoad);
                                window.removeEventListener('orientationchange', lazyLoad);
                            }
                        }
                    });

                    active = false;
                }, 0);
            }
        };

        lazyLoad();

        document.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
        window.addEventListener('orientationchange', lazyLoad);
    }

    private _imageType(lazyImage: HTMLImageElement): HTMLImageElement {
        const src = lazyImage.dataset.src;
        const srcset = lazyImage.dataset.srcset;

        (lazyImage.parentNode as any).style.cssText = `
                background-color: #f5f6f7;
                background-image: url(${window.projectConfig.assets}/img/preloaders/image-preloader.gif);
                background-repeat: repeat-y;
                background-size: 100% 1px;
              `;

        const image = new Image();
        image.onload = () => {
            lazyImage.src = src || lazyImage.src;
            lazyImage.srcset = srcset || '';
            lazyImage.addEventListener(helpers.whichTransitionEvent(), () => {
                (lazyImage.parentNode as any).style.cssText = '';
            });
            lazyImage.classList.remove('project-lazy-load-image');
        };

        image.src = src || lazyImage.src;
        image.srcset = srcset || '';

        return lazyImage;
    }

    private _backgroundType(lazyImage: HTMLElement): HTMLElement {
        const src = lazyImage.dataset.src;

        if (src) {
            const img = new Image();
            img.onload = () => {
                lazyImage.classList.remove('lazy-background');
            };
            img.src = src;
        } else {
            lazyImage.classList.remove('lazy-background');
        }

        return lazyImage;
    }
}
