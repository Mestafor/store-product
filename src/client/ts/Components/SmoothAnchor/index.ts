import helpers from '../../helpers';

export default class SmoothAnchor {
    private _params: any;

    static get default() {
        return {
            scroll: document,
        };
    }

    static _animate(options: any) {
        const start = performance.now();

        requestAnimationFrame(function animate(time) {
            // timeFraction от 0 до 1
            let timeFraction = (time - start) / options.duration;
            if (timeFraction > 1) {
                timeFraction = 1;
            }

            // текущее состояние анимации
            const progress = options.timing(timeFraction);

            options.draw(progress);

            if (timeFraction < 1) {
                requestAnimationFrame(animate);
            }
        });
    }

    constructor(params: {}) {
        this._params = Object.assign({}, SmoothAnchor.default, params);
    }

    get scroll() {
        return this._params.scroll;
    }

    scrollTo(target: any, duration = 200, delay = 16) {
        const destinationElem = target;
        const topIndent: any = 0;
        const scroll = helpers.getScrollState(this.scroll).target;
        const position = destinationElem.getBoundingClientRect();
        const top = position.top - Number.parseInt(topIndent, 10);
        const scrollTop = scroll.scrollTop;

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                SmoothAnchor._animate({
                    duration,
                    timing: (timeFraction: any) => {
                        return timeFraction;
                    },
                    draw: (progress: number) => {
                        progress = progress < 0 ? 0 : progress;
                        scroll.scrollTop = scrollTop + top * progress;

                        if (progress >= 1) {
                            resolve();
                        }
                    },
                });
            }, delay);
        });
    }

    run(target: any) {
        let anchor = target.getAttribute('href');
        if (!anchor) {
            return;
        }

        anchor =
            anchor[0] === '#' ? anchor.replace('#', '') : anchor.replace(/\S+#/g, '');
        const destinationElem = anchor
            ? document.getElementById(anchor)
            : document.body;

        if (!destinationElem) {
            return;
        }

        const topIndent: any = 0;

        const scroll = helpers.getScrollState(this.scroll).target;
        const position = destinationElem.getBoundingClientRect();
        let top = position.top - Number.parseInt(topIndent, 10);
        const scrollTop = scroll.scrollTop;

        if (
            this.scroll.classList &&
            this.scroll.classList.contains('wpw') &&
            target.classList.contains('scroll-top-button')
        ) {
            top = -scrollTop;
        }

        SmoothAnchor._animate({
            duration: 200,
            timing: (timeFraction: any) => {
                return timeFraction;
            },
            draw: (progress: any) => {
                progress = progress < 0 ? 0 : progress;
                scroll.scrollTop = scrollTop + top * progress;
            },
        });
    }
}
