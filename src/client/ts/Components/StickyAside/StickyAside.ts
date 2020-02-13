/**
 * Sticky aside
 * Fix aside to relative content on scroll
 */

// Dependencies
// import './_style.scss';

export interface IStickyAsideConfig {
    el: HTMLElement;
    topHeader: HTMLElement;
    fixBlockAfterHide?: boolean;
    onUnfixCallback?: () => void;
}

const TOP_INDENT = 0;

enum RunStickyAsideOn {
    DESKTOP = 'desktop-only',
    MOBILE = 'mobile-only',
    ALL = 'all',
}

class StickyAsideInfo { }

class StickyAsideView { }

export class StickyAside {
    private readonly _$el: HTMLElement;
    private readonly _$topHeader: HTMLElement;
    private readonly _fixBlockAfterHide: boolean = false;
    private readonly _$relativeContent: HTMLElement;
    private _runState: string;
    private _state = {
        changeOnScroll: false,
        fixed: false,
        bottom: false,

        elementIsAbsoluted: false,
        elementIsFixedToTopScreen: false,
        elementIsFixedToBottomScreen: false,
        elementIsAbsolutedToBottomContent: false,
    };
    private _TOP_INDENT = TOP_INDENT;
    private _scrollTop = 0;

    private _onUnfix: () => void = () => { };

    constructor(config: IStickyAsideConfig) {
        this._$el = config.el;
        this._$topHeader = config.topHeader;
        if (config.fixBlockAfterHide) {
            this._fixBlockAfterHide = config.fixBlockAfterHide;
        }

        if (typeof config.onUnfixCallback === 'function') {
            this._onUnfix = config.onUnfixCallback;
        }

        const parent = this._$el.parentNode as HTMLElement;
        this._$relativeContent = parent;

        this._runState = this._$el.dataset.runState || RunStickyAsideOn.DESKTOP;

        if (this._$topHeader.classList.contains('project-header--relative')) {
            this._TOP_INDENT = 25;
        }

        const topIndent = this._$el.dataset.topIndent;
        if (typeof topIndent === 'string') {
            this._TOP_INDENT = +topIndent || 0;
        }

        if (this._$relativeContent) {
            const contentPos = this._$relativeContent.getBoundingClientRect();
            const elPos = this._$el.getBoundingClientRect();

            let _el;
            _el = this._$el;

            this._$el = _el;

            if (contentPos.height > elPos.height) {
                this._state.changeOnScroll = true;
            }
        }
    }

    onScroll(scrollTop: number, isResize = false) {
        let isScrollToTop = false;

        if (this._scrollTop === scrollTop && !isResize) {
            return;
        }

        if (this._scrollTop > scrollTop) {
            isScrollToTop = true;
        }

        this._scrollTop = scrollTop;

        if (this._runState === RunStickyAsideOn.DESKTOP) {
            if (window.innerWidth < 992) {
                this._unfix();
                return;
            } else {
            }
        } else if (this._runState === RunStickyAsideOn.MOBILE) {
            if (window.innerWidth >= 992) {
                this._unfix();
                return;
            }
        }

        // Check scroll state
        // if (this._state.changeOnScroll) {
        // Check, if all elems is available
        if (this._$el && this._$topHeader && this._$relativeContent) {
            this._changeOnScroll(isScrollToTop);
        }
        // }
    }

    onResize(scrollTop: number) {
        this._$relativeContent.style.minHeight = '';

        setTimeout(() => {
            this._unfix();
            this.onScroll(scrollTop, true);
        }, 0);
    }

    private _caluclateContentTopPos(elPos: ClientRect, contentPos: ClientRect) {
        if (this._fixBlockAfterHide) {
            return contentPos.top + elPos.height + this._TOP_INDENT;
        } else {
            return contentPos.top;
        }
    }

    /**
     * TODO: Упростити, надто важка логіка для зрозуміння
     * @param isScrollToTop
     */
    private _changeOnScroll(isScrollToTop: boolean) {
        // Get positions
        const elPos = this._$el.getBoundingClientRect();
        const contentPos = this._$relativeContent.getBoundingClientRect();

        const topIndent = this._TOP_INDENT;

        const contentTopY = this._caluclateContentTopPos(elPos, contentPos);
        const contentBottomY = contentPos.bottom;
        const elBottomY = elPos.bottom;
        const elTopY = elPos.top;

        if(elPos.height >= contentPos.height) {
            return;
        }

        // TODO: use fsm for block states

        // Якщо елемент поміщається на екран
        if (window.innerHeight > elPos.height) {
            const fixedBottomStyle = `
                position: absolute;
                top: unset;
                bottom: 0;
                width: ${contentPos.width}px;
            `;

            if (topIndent < contentTopY) {
                this._unfix();
            } else if (
                topIndent >= contentBottomY ||
                elBottomY >= contentBottomY ||
                topIndent + elPos.height >= contentBottomY
            ) {
                if (this._state.bottom && topIndent < elTopY) {
                    if (!this._state.elementIsFixedToTopScreen) {
                        this._fixToTopScreen(elPos, contentPos, topIndent);
                    }
                } else {
                    if (!this._state.elementIsAbsolutedToBottomContent) {
                        this._absoluteToBottomContent(fixedBottomStyle);
                    }
                }
            } else {
                if (!this._state.elementIsFixedToTopScreen) {
                    this._fixToTopScreen(elPos, contentPos, topIndent);
                }
            }
        }
        else {
            const elementIsFixedToBottom =
                elBottomY - window.innerHeight + this._TOP_INDENT < 0;


            if (topIndent < contentTopY) {
                // В іншому випадку елемент знаходиться зверху контенту
                // тому його потрібно поставити на місце
                this._unfix();
            }
            // Якщо горається вверх то фіксувати по верхній границі
            else if (isScrollToTop) {
                if (elTopY >= topIndent) {
                    // Фіксувати до верхньої границі екрана тільки у випадку якщо
                    // верхня границя елемента більша за верхню границю контента
                    if (elTopY > contentTopY) {
                        if (!this._state.elementIsFixedToTopScreen) {
                            this._fixToTopScreen(elPos, contentPos, topIndent);
                        }
                    }
                }
                else 
                if (elTopY < topIndent) {
                    // Спозиціонувати елемент абсолютно відносно контенту
                    if (!elementIsFixedToBottom && !this._state.elementIsAbsoluted) {
                        const top = -contentTopY + elPos.top;
                        const fixedStyle = `
                            position: absolute;
                            top: ${top}px;
                            left: unset;
                            right: unset;
                            width: ${contentPos.width}px;
                        `;
                        this._absoluteToContent(fixedStyle);
                    }
                }
            }
            // Якщо гортається вниз то фіксувати по нижній границі
            else {
                if (this._state.elementIsFixedToTopScreen) {
                    const top = -contentTopY + elPos.top + topIndent;
                    const fixedStyle = `
                        position: absolute;
                        top: ${top}px;
                        left: unset;
                        right: unset;
                        width: ${contentPos.width}px;
                      `;
                    this._absoluteToContent(fixedStyle);
                }
                // Якщо контент відносо якого фіксується елемент знаходиться вище нижньої границі екрана,
                // зробити цей елемент абсолютом до низу
                else if (contentBottomY + topIndent < window.innerHeight) {
                    if (!this._state.elementIsAbsolutedToBottomContent) {
                        const fixedBottomStyle = `
                          position: absolute;
                          top: unset;
                          bottom: 0;
                          width: ${contentPos.width}px;
                        `;

                        this._absoluteToBottomContent(fixedBottomStyle);
                    }
                }
                // Якщо нижня границя елемента знаходиться вище нижньої границі контенту,
                // зафіксувати до нижньої границі екрана
                else if (elBottomY + topIndent < window.innerHeight) {
                    if (!this._state.elementIsFixedToBottomScreen) {
                        this._fixToBottomScreen(elPos, contentPos, topIndent);
                    }
                }
            }
        }
    }

    private _absoluteToBottomContent(fixedStyle) {
        if (!this._$el.classList.contains('--fix')) {
            this._$el.classList.add('--fix');
        }

        this._$el.style.cssText = fixedStyle;
        this._state.elementIsAbsoluted = false;
        this._state.elementIsAbsolutedToBottomContent = true;
        this._state.elementIsFixedToBottomScreen = false;
        this._state.elementIsFixedToTopScreen = false;

        this._state.bottom = true;
        this._state.fixed = false;
    }

    private _absoluteToContent(fixedStyle) {
        if (!this._$el.classList.contains('--fix')) {
            this._$el.classList.add('--fix');
        }

        this._$el.style.cssText = fixedStyle;
        this._state.elementIsAbsoluted = true;
        this._state.elementIsAbsolutedToBottomContent = false;
        this._state.elementIsFixedToBottomScreen = false;
        this._state.elementIsFixedToTopScreen = false;
    }

    private _fixToBottomScreen(
        elPos: ClientRect,
        contentPos: ClientRect,
        topIndent: number
    ) {

        if (!this._$el.classList.contains('--fix')) {
            this._$el.classList.add('--fix');
        }

        const fixedStyle = `
            position: fixed;
            bottom: ${topIndent}px;
            left: ${contentPos.left}px;
            right: unset;
            width: ${contentPos.width}px;
        `;

        this._$el.style.cssText = fixedStyle;
        this._state.elementIsAbsoluted = false;
        this._state.elementIsAbsolutedToBottomContent = false;
        this._state.elementIsFixedToBottomScreen = true;
        this._state.elementIsFixedToTopScreen = false;
    }

    private _fixToTopScreen(
        elPos: ClientRect,
        contentPos: ClientRect,
        topIndent: number
    ) {

        if (!this._$el.classList.contains('--fix')) {
            this._$el.classList.add('--fix');
        }

        let left: number;
        if (this._$el.classList.contains('project-asides-block__aside--right')) {
            left = contentPos.right - elPos.width;
        }
        else {
            left = contentPos.left;
        }

        const fixedStyle = `
          position: fixed;
          top: ${topIndent}px;
          left: ${left}px;
          right: unset;
          width: ${contentPos.width}px;
        `;
        this._$el.style.cssText = fixedStyle;

        this._state.elementIsAbsoluted = false;
        this._state.elementIsAbsolutedToBottomContent = false;
        this._state.elementIsFixedToBottomScreen = false;
        this._state.elementIsFixedToTopScreen = true;

        this._state.fixed = true;
        this._state.bottom = false;
    }

    private _unfix() {

        if (this._$el.classList.contains('--fix')) {
            this._$el.classList.remove('--fix');
        }

        this._$el.style.cssText = '';
        this._$relativeContent.style.minHeight = '';
        this._state.fixed = false;
        this._state.bottom = false;

        this._state.elementIsAbsoluted = false;
        this._state.elementIsAbsolutedToBottomContent = false;
        this._state.elementIsFixedToBottomScreen = false;
        this._state.elementIsFixedToTopScreen = false;

        this._onUnfix();
    }
}
