import SmoothAnchor from "../Components/SmoothAnchor";

export class ClickBehaviourHelper {

    static programClick(selectors: string[] = [], context = document) {
        selectors.forEach(selector => {
            context.querySelectorAll<HTMLElement>(selector)
                .forEach(el => {
                    el.click();
                });
        });
    }

    static goTo(idTarget: string) {
        const destinationTarget = document.querySelector<HTMLElement>(idTarget);
        if (destinationTarget) {
            new SmoothAnchor({}).scrollTo(destinationTarget);
        }
    }

    static openAccordion(idAccordionTitle: string) {
        const accordionTitle = document.querySelector<HTMLElement>(idAccordionTitle);
        if (accordionTitle) {
            const parent = accordionTitle.parentNode as HTMLElement;

            if (parent && !parent.classList.contains('project-accordion--opened')) {
                accordionTitle.click();
            }
        }
    }

}
