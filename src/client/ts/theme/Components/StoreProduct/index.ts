import { CommentView } from "./Comment/CommentView";
import EventSubscriber from "../../../lib/Observer/EventSubscriber";
import { AppActions } from "../../../app";

/**
 * All what we need in the store product page
 */

export class StoreProductContainer {

    static init() {

        /**
         * Comments
         */
        document.querySelectorAll<HTMLElement>('.js-project-comment')
            .forEach($comment => {
                new CommentView($comment, {
                    onChange: () => {
                        EventSubscriber.dispatch(AppActions.UPDATE_STICKY_ASIDE_POSITION);
                    }
                });
            });
    }

}
