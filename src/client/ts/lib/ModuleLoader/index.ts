/**
 * Модуль для підгрузки скриптів
 * Singleton
 * 
 * How to add:
 * 1. Add class name to DynamicModulesList
 * 2. In method _getModule in class Loader add relative path to the module
 */

export enum DynamicModulesList {
    
    // ScrollStatusLine
    SCROLL_STATUS_LINE = 'ScrollStatusLine',

    // Scroll Line
    SCROLL_LINE = 'ScrollLine',

    // BlogPostCarousel
    BLOG_POST_CAROUSEL = 'BlogPostcarousel',

    // ShowInViewport
    SHOW_IN_VIEWPORT = 'ShowInViewport',

    // Accordion
    ACCORDION = 'Accordion',

    // Tab
    TAB = 'Tab',

};

interface ILoader {
    load<T>(settings: { name: string }): Promise<T>;
}

class Loader implements ILoader {
    static instance: Loader;
    private _modules: { [key: string]: any } = {};

    constructor() {
        if (!Loader.instance) {
            Loader.instance = this;
        }

        return this;
    }

    private _getModule(name: string): Promise<any> {
        switch (name) {
            // webpack не сприймає строку через змінну тому приходиться прописувати шлях вручну
            // це треба дослідити

            // ScrollStatusLine
            case DynamicModulesList.SCROLL_STATUS_LINE: {
                return import('./../../Components/Scroll/ScrollStatusLine');
            }

            // ScrollLine
            case DynamicModulesList.SCROLL_LINE: {
                return import('./../../Components/ScrollLine');
            }

            // BlogPostCarousel
            case DynamicModulesList.BLOG_POST_CAROUSEL: {
                return import('./../../Components/BlogPostCarousel');
            }

            // ShowInViewport
            case DynamicModulesList.SHOW_IN_VIEWPORT: {
                return import('../../Components/ShowInViewport');
            }

            // Accordion
            case DynamicModulesList.ACCORDION: {
                return import('../../Components/Accordion');
            }

            // Tab
            case DynamicModulesList.TAB: {
                return import('../../Components/Tabs');
            }

            default:
                return Promise.reject(new Error('Module Not Found'));
        }
    }

    load<T>(setting: { name: DynamicModulesList }): Promise<T> {
        if (!this._modules[setting.name]) {
            return this._getModule(setting.name).then(module => {
                this._modules[setting.name] = module;
                return this._modules[setting.name];
            });
        } else {
            return Promise.resolve(this._modules[setting.name]);
        }
    }
}

export default new Loader();
