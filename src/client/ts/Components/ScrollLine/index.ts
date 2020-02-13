export interface IscrollLineFn {
    (list: HTMLElement): IscrollLine;
}

export interface IscrollLine {
    el: HTMLElement;
    init: () => IscrollLine;
    updateSize: () => IscrollLine;
    updateTop: () => IscrollLine;
    clear: () => void;
    setGradient: (scrollTop: number) => void;
    removeGradient: () => void;
};

export const scrollLine: IscrollLineFn = function (parent: HTMLElement): IscrollLine {
    let hasScroll = false;
    // const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    // const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    const dropDownList = parent;
    const dropDownListWrapper = parent.parentNode;

    const showTopBottomGradient: boolean = parent.classList.contains('custom-scroll--top-bottom-gradient');

    if (dropDownListWrapper) {
        const listWidth = dropDownList.clientWidth;
        const listScrollWidth = dropDownList.offsetWidth;
        const scrollWidth = listScrollWidth - listWidth;

        if (scrollWidth) {
            dropDownList.style.marginRight = `-${scrollWidth}px`;
        }

        dropDownListWrapper.addEventListener('mouseenter', () => {
            methods.updateSize();
        });
    }

    let scrollHeight = parent.scrollHeight;
    let clientHeight = parent.clientHeight;
    // let lineHeight = (clientHeight - (scrollHeight - clientHeight)) * 100 / clientHeight;
    let lineHeight = (clientHeight / scrollHeight) * clientHeight;
    const scrollLine = document.createElement('span');
    scrollLine.className = 'project-scroll-line hide';

    if (scrollHeight > clientHeight) {
        hasScroll = true;
    }

    let scrolling = false;
    parent.addEventListener('scroll', (e: Event) => {
        if (scrolling) return;
        scrolling = true;
        requestAnimationFrame(() => {
            methods.updateSize();
            methods.updateTop();
            scrolling = false;
        });
    });

    parent.addEventListener<'mouseenter'>('mouseenter', () => {
        requestAnimationFrame(() => {
            methods.updateSize();
        });
    });

    parent.addEventListener('click', (e: Event) => {
        methods.updateSize();
    });

    const methods = {
        el: parent,
        init() {
            //if (hasScroll) {
                scrollLine.style.height = `${lineHeight - 6}px`;
                parent.appendChild(scrollLine);
                methods.setGradient(0);
            //}
            return methods;
        },

        updateSize() {
            // if (hasScroll) {
            scrollHeight = parent.scrollHeight;
            clientHeight = parent.clientHeight;
            // lineHeight = (clientHeight - (scrollHeight - clientHeight)) * 100 / clientHeight;
            lineHeight = (clientHeight / scrollHeight) * clientHeight;
            if (scrollHeight > clientHeight) {
                hasScroll = true;
                scrollLine.classList.remove('hide');
                methods.updateTop();
            } else {
                hasScroll = false;
                scrollLine.classList.add('hide');
                methods.clear();
            }
            // }
            return methods;
        },

        updateTop() {
            if (hasScroll) {
                const scrollTop = parent.scrollTop;
                // const top = scrollTop / clientHeight * (clientHeight - lineHeight);
                const top =
                    (((scrollTop * 100) / (scrollHeight - clientHeight)) *
                        (clientHeight - lineHeight)) /
                    100;
                scrollLine.style.cssText = `
                  height: ${lineHeight - 6}px;
                  -webkit-transform: translateY(${top}px) translateZ(0);
                  transform: translateY(${top}px) translateZ(0);
                `;

                // Add class top-gradient/bottom-gradient
                methods.setGradient(scrollTop);
            }
            else {
                methods.removeGradient()
            }

            return methods;
        },

        clear() {
            // if (hasScroll) {
            scrollLine.style.cssText = ``;
            lineHeight = 3;
            scrollLine.style.height = `${lineHeight - 3}%`;
            // }
        },

        setGradient(scrollTop: number) {

            if (showTopBottomGradient) {
                if (scrollTop === 0) {
                    parent.classList.remove('top-gradient');
                    parent.classList.add('bottom-gradient');
                }
                else if (scrollTop >= scrollHeight - clientHeight) {
                    parent.classList.add('top-gradient');
                    parent.classList.remove('bottom-gradient');
                }
                else {
                    parent.classList.add('top-gradient');
                    parent.classList.add('bottom-gradient');
                }
            }
        },

        removeGradient() {
            if (showTopBottomGradient) {
                parent.classList.remove('top-gradient');
                parent.classList.remove('bottom-gradient');
            }
        }
    };

    return methods;
}

export function scrollLineManager() {
    const scrollLines: any[] = [];

    return {
        init(el: HTMLElement) {
            if (!el) {
                return;
            }

            scrollLines.push(scrollLine(el));
        },
    };
}

export default scrollLineManager();
