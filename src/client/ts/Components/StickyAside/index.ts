import { StickyAside, IStickyAsideConfig } from './StickyAside';

function StickyAsideManager() {
    const instances: StickyAside[] = [];

    const methods = {
        add(config: IStickyAsideConfig) {
            instances.push(new StickyAside(config));
        },
        onScroll(scrollTop: number) {
            instances.forEach(instance => {
                instance.onScroll(scrollTop);
            });
        },
        onResize(scrollTop: number) {
            instances.forEach(instance => {
                instance.onResize(scrollTop);
            });
        },
    };

    return methods;
}

export default StickyAsideManager();
