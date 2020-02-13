/**
 * BoxInput
 * Приймає DOM елемент в якому міститься input типу checkbox або radio, контроллери
 * input/radio optional
 * Контроллери - елементи на які вішається івент click який закриває або показує блоки
 */

interface IBoxInput {
    toggle(e?: Event): Promise<void>;
    activate(e?: Event): Promise<void>;
    deactivate(e?: Event): Promise<void>;
}

export interface BoxInputHTMLElement extends HTMLElement {
    instance?: BoxInput,
}

//interface IBoxInputStorage {
//    [key: string]: BoxInput[]
//}

//const BoxInputStorage: IBoxInputStorage = {};

export class BoxInput implements IBoxInput {
    private static _changeEvent = new CustomEvent('change');
    private _$el: BoxInputHTMLElement;
    private _$input: HTMLInputElement | null;
    private _$activateControllers: NodeListOf<HTMLElement>;
    private _$deactivateControllers: NodeListOf<HTMLElement>;
    private _$toggleControllers: NodeListOf<HTMLElement>;
    private _state = {
        active: false,
    };

    constructor(el: HTMLElement) {
        this._$el = el;

        this._$input = this._$el.querySelector('.box__input');
        this._$activateControllers = this._$el.querySelectorAll('.box__activate');
        this._$deactivateControllers = this._$el.querySelectorAll('.box__deactivate');
        this._$toggleControllers = this._$el.querySelectorAll('.box__toggle');

        this._$activateControllers.forEach(activate => {
            activate.addEventListener('click', this.activate);
        });

        this._$deactivateControllers.forEach(deactivate => {
            deactivate.addEventListener('click', this.deactivate);
        });

        this._$toggleControllers.forEach(toggle => {
            toggle.addEventListener('click', this.toggle);
        });

        if (this._$input) {
            this._$input.addEventListener('change', (e) => {
                this._state.active = !!(e.currentTarget as HTMLInputElement).checked;

                //debugger;
                //Object.values(BoxInputStorage)
                //    .forEach((value) => {
                //        value.forEach(box => {
                //            if (box !== this) {
                //                box.deactivate();
                //            }
                //        });
                //    });
            });
        }

        this._$el.classList.add('box--inited');

        this._$el.instance = this;

        this._addToStorage();
    }

    private foxusInputElement() {
        const focusableEl = this._$el.querySelector('input.--focus') as HTMLInputElement;

        if (focusableEl) {
            focusableEl.focus();
        }
    }

    private _addToStorage() {
        //const group = this._$el.dataset.boxRadioGroup;

        //if (group) {
        //    if (!BoxInputStorage[group]) {
        //        BoxInputStorage[group] = [];
        //    }

        //    BoxInputStorage[group].push(this);
        //}
    }

    toggle = (e?: Event): Promise<void> => {
        if (e) {
            e.preventDefault();
        }

        this._$el.classList.toggle('box--active');

        if (this._$input) {
            this._$input.checked = !this._$input.checked;
            this._$input.dispatchEvent(BoxInput._changeEvent);
        }
        else {
            this._state.active = this._$el.classList.contains('box--active');
        }

        if (this._state.active) {
            this.foxusInputElement();
        }

        return Promise.resolve();
    }

    activate = (e?: Event): Promise<void> => {
        if (e) {
            e.preventDefault();
        }

        if (!this._state.active) {

            this._$el.classList.add('box--active');
            this.foxusInputElement();

            if (this._$input) {
                this._$input.checked = true;
                this._$input.dispatchEvent(BoxInput._changeEvent);
            } else {
                this._state.active = true;
            }
        }


        return Promise.resolve();
    }

    deactivate = (e?: Event): Promise<void> => {
        if (e) {
            e.preventDefault();
        }

        if (this._state.active) {

            this._$el.classList.remove('box--active');

            if (this._$input) {
                this._$input.checked = true;
                this._$input.dispatchEvent(BoxInput._changeEvent);
            }
            else {
                this._state.active = false;
            }
        }

        return Promise.resolve();
    }

}