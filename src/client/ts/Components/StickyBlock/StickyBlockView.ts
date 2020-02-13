export interface StickyBlockHTMLElement extends HTMLElement {
    dataset: {
        topSelector?: string;
        bottomSelector?: string;
        fixedClass?: string;
    }
}

export class StickyBlockView {
    private _$topNode: HTMLElement | null = null;
    private _$bottomNode: HTMLElement | null = null;
    private _fixedClass = '--fixed';

    constructor(private _$node: StickyBlockHTMLElement) {
        const topNodeSelector = this._$node.dataset.topSelector;
        const bottomNodeSelector = this._$node.dataset.bottomSelector;
        const fixedClass = this._$node.dataset.fixedClass;
        if (fixedClass) {
            this._fixedClass = fixedClass;
        }

        if (topNodeSelector) {
            this._$topNode = document.querySelector(topNodeSelector);
        }

        if (bottomNodeSelector) {
            this._$bottomNode = document.querySelector(bottomNodeSelector);
        }

        this._$node.classList.add('sticky-block--inited');
    }

    onScroll() {
        if (this._$topNode && this._$bottomNode) {
            const topNodeCoordinates = this._$topNode.getBoundingClientRect();
            const bottomNodeCoordinates = this._$bottomNode.getBoundingClientRect();

            if (topNodeCoordinates.bottom < 0) {
                if (bottomNodeCoordinates.bottom < window.innerHeight) {
                    this._$node.classList.remove(this._fixedClass);
                }
                else {
                    this._$node.classList.add(this._fixedClass);
                }
            }
            else {
                this._$node.classList.remove(this._fixedClass);
            }
        }
    }
}