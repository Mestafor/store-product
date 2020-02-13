/*
 * Helpers for different issue
 */

// Dependency
import 'whatwg-fetch';

// Container for helpers
const helpers = {

    formDataToJson(form: HTMLFormElement): { [key: string]: string | number } {
        const excludeFields = ['submit'];

        return Array.from(form).reduce((obj, input: Element) => {
            if (
                input &&
                (input as HTMLInputElement).name &&
                !excludeFields.includes[(input as HTMLInputElement).type]
            ) {
                let value: string | boolean;

                if (['checkbox', 'radio'].includes((input as HTMLInputElement).type)) {
                    value = (input as HTMLInputElement).checked;
                } else {
                    value = (input as HTMLInputElement).value;
                }

                obj[(input as HTMLInputElement).name] = value;
            }

            return obj;
        }, {});
    },

    /**
     * Form data to form string
     * @param items
     */
    formDataToFormString(form: HTMLFormElement): string {
        const excludeFields = ['submit'];

        return Array.from(form).reduce((str, input: Element) => {
            if (
                (input as HTMLInputElement).name &&
                !excludeFields.includes[(input as HTMLInputElement).type]
            ) {
                if (str) {
                    str += '&';
                }

                let value: string | boolean;

                if (['checkbox', 'radio'].includes((input as HTMLInputElement).type)) {
                    value = (input as HTMLInputElement).checked;
                } else {
                    value = (input as HTMLInputElement).value;
                }

                str += `${(input as HTMLInputElement).name}=${value}`;
            }

            return str;
        }, '');
    },

    /**
     *
     * @param { HTMLFormElement } form - form element
     */
    clearForm(form: HTMLFormElement) {
        const excludeFields = ['select', 'submit'];
        const excludeByTag = ['SELECT'];

        const changeEvent = new CustomEvent('change');

        Array.from(form).forEach((input: any) => {
            if (
                ['radio', 'checkbox']
                    .includes((input as HTMLInputElement).type)
            ) {
                (input as HTMLInputElement).checked = false;
                (input as HTMLInputElement).dispatchEvent(changeEvent);
            }
            else if (
                input.value &&
                !excludeFields.includes(input.name) &&
                !excludeByTag.includes(input.tagName)
            ) {
                input.value = '';
                input.setAttribute('value', '');
                (input as HTMLInputElement).dispatchEvent(changeEvent);
            }
        });
    },

    /**
     * Додає делей для кожного пункту збільшуючи його відповідно
     * @param items
     */
    itemsAnimDelay(items: NodeListOf<HTMLElement>) {
        let delay = 0;

        const MAX_DELAY = 0.2;
        const STEP = 0.03;
        items.forEach((li, index) => {
            if (index > 0 && delay < MAX_DELAY) {
                delay += STEP;
            }

            li.style.cssText = `
          transition-delay: ${delay}s, ${delay}s;
          -webkit-transition-delay: ${delay}s, ${delay}s;

          animation-delay: ${delay}s, ${delay}s;
          -webkit-animation-delay: ${delay}s, ${delay}s;
        `;
        });
    },

    throttle(fn, wait) {
        let time = Date.now();
        return (e?) => {
            if (time + wait - Date.now() < 0) {
                fn(e);
                time = Date.now();
            }
        };
    },

    fetch(url: string, settings: RequestInit | undefined): Promise<Response> {
        return fetch(url, settings);
    },

    getScrollState(elem: any) {
        let scroll;
        if (elem === document) {
            scroll = document.documentElement ? document.documentElement : document.body;
        }
        else {
            scroll = elem;
        }


        return {
            target: scroll,
            scrollTop: scroll.scrollTop,
            scrollHeight: scroll.scrollHeight,
        };
    },

    isIE() {
        const ua = window.navigator.userAgent;

        const msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return Number.parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        const trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            const rv = ua.indexOf('rv:');
            return Number.parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        const edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return Number.parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }

        // other browser
        return false;
    },

    animationEndEvent: '',
    // Get supported animation event
    whichAnimationEvent() {
        if (!helpers.animationEndEvent) {
            const el = document.createElement('fakeelement');

            const animations = {
                animation: 'animationend',
                OAnimation: 'oAnimationEnd',
                MozAnimation: 'animationend',
                WebkitAnimation: 'webkitAnimationEnd',
            };

            for (const t in animations) {
                if (el.style[t] !== undefined) {
                    helpers.animationEndEvent = animations[t];
                    break;
                }
            }
        }

        return helpers.animationEndEvent as
            | 'animationend'
            | 'oAnimationEnd'
            | 'webkitAnimationEnd';
    },

    transitionEndEvent: '',
    // Get supported transition event
    whichTransitionEvent(): any {
        if (!helpers.transitionEndEvent) {
            const el = document.createElement('fakeelement');

            const transitions = {
                transition: 'transitionend',
                OTransition: 'oTransitionEnd',
                MozTransition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
            };

            for (const t in transitions) {
                if (el.style[t] !== undefined) {
                    helpers.transitionEndEvent = transitions[t];
                    break;
                }
            }
        }

        return helpers.transitionEndEvent as
            | 'transitionend'
            | 'oTransitionEnd'
            | 'webkitTransitionEnd';
    },

    getParentByClass(item: HTMLElement, searchSelector: string) {
        let parent = item.parentNode as HTMLElement | null;

        while (parent && !parent.classList.contains(searchSelector)) {
            parent = parent.parentNode as HTMLElement;

            if (parent.tagName === 'BODY') {
                parent = null;
            }
        }

        return parent;
    },

    node(x: HTMLElement) {
        const methods = {
            attr(obj: { [key: string]: string }) {
                if (x !== null && obj) {
                    Object.entries(obj).forEach(([key, value]) => {
                        if (x) x.setAttribute(key, value);
                    });
                }

                return methods;
            },
            innerHtml(html: string) {
                if (x) {
                    x.innerHTML = html;
                }
                return methods;
            },
            add(nodeEl: HTMLElement | DocumentFragment) {
                if (x) {
                    x.appendChild(nodeEl);
                }

                return methods;
            },
            event(event: string, callback: EventListenerOrEventListenerObject) {
                if (x) {
                    x.addEventListener(event, callback);
                }

                return methods;
            },
            getNode() {
                return x;
            },
        };

        return methods;
    },

    openWindow(target: HTMLLinkElement) {
        const href =
            typeof target.href === 'string' && target.href.length > 0
                ? target.href
                : null;
        if (href) {
            window.open(
                href,
                '_blank',
                'scrollbars=0, resizable=1, menubar=0, left=100, top=100, width=550, height=440, toolbar=0, status=0'
            );
        }
    },

    createNode(nodeName: string) {
        const _nodeName =
            typeof nodeName === 'string' && nodeName.length > 0 ? nodeName : false;
        let x: HTMLElement;

        const methods = {
            attr(obj: { [key: string]: string }) {
                if (x !== null && obj) {
                    Object.entries(obj).forEach(([key, value]) => {
                        if (x) x.setAttribute(key, value);
                    });
                }

                return methods;
            },
            innerHtml(html: string) {
                if (x) {
                    x.innerHTML = html;
                }
                return methods;
            },
            add(nodeEl: HTMLElement | DocumentFragment) {
                if (x) {
                    x.appendChild(nodeEl);
                }

                return methods;
            },
            event(event: string, callback: EventListenerOrEventListenerObject) {
                if (x) {
                    x.addEventListener(event, callback);
                }

                return methods;
            },
            getNode() {
                return x;
            },
        };

        if (_nodeName) {
            x = document.createElement(nodeName);
        }

        return methods;
    },
};

// Export module
export default helpers;
