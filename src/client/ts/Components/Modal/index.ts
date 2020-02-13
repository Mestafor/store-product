/**
 * Modal window
 */


// Dependencies
import './_modal.scss';
import helpers from '../../helpers';
import {
    disableBodyScroll,
    enableBodyScroll,
} from 'body-scroll-lock';

interface IModalConfig {
    modal: HTMLElement;
    beforeOpen?: (target: HTMLElement) => void;
    afterOpen?: (modal: HTMLElement) => void;
    beforeClose?: (modal: HTMLElement) => void;
    afterClose?: (modal: HTMLElement) => void;
}

class Modal {
    private readonly _config: IModalConfig;
    private readonly _$modal: HTMLElement;
    private readonly _modalId: string | undefined;
    private _$activeTargets: HTMLElement[] = [];
    private _isOpen = false;

    constructor(config: IModalConfig) {
        this._config = Object.assign({}, config);
        this._$modal = config.modal;
        this._modalId = this._$modal.dataset.modal;
    }

    init(context: HTMLElement | Document = document) {
        // Init click
        this.initClick();

        // On animation end
        this._$modal.addEventListener(helpers.whichAnimationEvent(), e => {
            if (this._$modal.classList.contains('project-modal--closing')) {
                this._$modal.classList.remove('project-modal--closing');

                if (typeof this._config.afterClose === 'function') {
                    this._config.afterClose(this._$modal);
                }
            }
        });

        this._$modal.addEventListener('click', (e: Event) => {
            this.close();
        });

        const content = this._$modal.querySelector('.project-modal__content');
        if (content) {
            content.addEventListener('click', (e: Event) => {
                e.stopPropagation();
            });
        }

        Array.from(this._$modal.querySelectorAll('.js-modal-close')).forEach(
            elem => {
                elem.addEventListener('click', e => {
                    e.preventDefault();
                    this.close();
                });
            }
        );

        // Init touch event
        // TODO: why i added it?
        // this.initTouch();
    }

    initTouch() {
        if ('ontouchstart' in document.documentElement) {
            let startY;
            let endY;

            const onStart = (e: TouchEvent) => {
                startY = endY = e.touches[0].clientY;
                document.addEventListener('touchmove', onMove);
                document.addEventListener('touchend', onEnd);
            };

            const onMove = (e: TouchEvent) => (endY = e.touches[0].clientY);

            const onEnd = () => {
                const dest = startY - endY;
                if (Math.abs(dest) > 50) {
                    this.close();
                }
                document.removeEventListener('touchmove', onMove);
                document.removeEventListener('touchend', onEnd);
            };

            this._$modal.addEventListener('touchstart', onStart);
        }
    }

    initClick(context: HTMLElement | Document = document) {
        // Open elements
        const openModalLinks = context.querySelectorAll(
            `[data-modal-id="${
            this._modalId
            }"][data-modal-action="open"]:not(.project-modal--click-inited)`
        ) as NodeListOf<HTMLElement>;

        // Close elements
        const closeModalLinks = context.querySelectorAll(
            `[data-modal-id="${
            this._modalId
            }"][data-modal-action="close"]:not(.project-modal--click-inited)`
        ) as NodeListOf<HTMLElement>;

        [...Array.from(closeModalLinks), ...Array.from(openModalLinks)].forEach(
            item => {
                item.classList.add('project-modal--click-inited');
                const action = item.dataset.modalAction;

                item.addEventListener('click', (e: Event) => {
                    const target = e.currentTarget as HTMLElement;
                    e.preventDefault();

                    if (action && typeof this[action] === 'function') {
                        this[action](target);
                    }
                });
            }
        );
    }

    open(target: HTMLElement) {
        if (!this._isOpen) {
            const classToAdd = target.dataset.modalAddClassOnOpen;

            if (typeof this._config.beforeOpen === 'function') {
                this._config.beforeOpen(target);
            }

            requestAnimationFrame(() => {
                
                if (!this._$modal.classList.contains('project-modal--no-blocked')) {
                    document.documentElement.classList.add('js-modal-opened');
                    disableBodyScroll(this._$modal);
                }

                this._$modal.classList.add('project-modal--opened');

                if (classToAdd) {
                    target.classList.add(classToAdd);
                }

                if (typeof this._config.afterOpen === 'function') {
                    this._config.afterOpen(this._$modal);
                }

                // Add target to array. When modal closing, remove all behaviour from target
                this._$activeTargets.push(target);
                this._isOpen = true;
            });
        } else {
            this.close();
        }
    }

    close() {
        if (typeof this._config.beforeClose === 'function') {
            this._config.beforeClose(this._config.modal);
        }

        requestAnimationFrame(() => {
            document.documentElement.classList.remove('js-modal-opened');
            enableBodyScroll(this._$modal);

            this._$modal.className = this._$modal.className.replace(
                'project-modal--opened',
                'project-modal--closing'
            );

            this._$activeTargets.forEach(target => {
                const classToAdd = target.dataset.modalAddClassOnOpen;
                if (classToAdd) {
                    target.classList.remove(classToAdd);
                }
            });
            this._$activeTargets.length = 0;
            this._isOpen = false;
        });
    }
}

class ModalManager {
    static modals: { [key: string]: Modal } = {};

    getModals() {
        return ModalManager.modals;
    }

    reinitClick() {
        Object.values(this.getModals()).forEach(instance => {
            instance.initClick();
        });
    }

    add(config: IModalConfig) {
        const el = config.modal;
        const id = el.dataset.modal;

        if (id && !Object.keys(ModalManager.modals).includes(id)) {
            const modal = new Modal(config);
            ModalManager.modals[id] = modal;
            modal.init();
        } else {
            console.error(
                'Modal name is not valid, or there are fiew modals with same name - ',
                id
            );
        }
    }
}

export default new ModalManager();
