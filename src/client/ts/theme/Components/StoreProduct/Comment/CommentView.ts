import { BoxInputHTMLElement } from "../../../../Components/BoxInput/BoxInput";


/*
 * Dependencies:
 * BoxInput
 */

/**
 * State: edit, replay, showComments
 */
const commentsStateMachine = {
    default: {
        edit: false,
        replay: false,
        showComments: false,
    },

    edit: {
        edit: true,
    },

    replay: {
        replay: true,
    },

    showComments: {
        showComments: true,
    },
};

const enum CssSelectors {
    Wrapper = 'js-project-comment',

    Header = 'js-project-comment__header',
    Body = 'js-project-comment__body',
    Controls = 'js-project-comment__controls',
    LeaveComment = 'js-project-comment__leave-comment',
    ReplayList = 'js-project-comment__reply-list',

    EditControl = "js-project-comment__edit-control",
    ShowCommentsControl = "js-project-comment__show-control",
    ReplyControl = "js-project-comment__reply-control",
    LikeControl = "js-project-comment__like-control",
    DislikeControl = "js-project-comment__dislike-control"
}

export class CommentView {

    private $wrapper: HTMLElement;
    private $body: HTMLElement | null = null;
    private $controlsWrapper: HTMLElement[] = []; // Could be only as a child of $wrapper
    private $replyList: HTMLElement | null = null;
    private $leaveComment: HTMLElement | null = null;
    private _config: { onChange?: () => void } = {};

    private state = commentsStateMachine.default;

    constructor(commentWrapper: HTMLElement, config?: {onChange?: () => void}) {
        this.$wrapper = commentWrapper;
        this.$body = this.$wrapper.querySelector(`.${CssSelectors.Body}`);
        this.$replyList = this.$wrapper.querySelector(`.${CssSelectors.ReplayList}`);
        this.$leaveComment = this.$wrapper.querySelector(`.${CssSelectors.LeaveComment}`);

        if(config) {
            this._config = config;
        }

        const children = this.$wrapper.children;
        for (let i = 0; i < children.length; i++) {
            if (children[i].classList.contains(CssSelectors.Controls)) {
                this.$controlsWrapper.push(children[i] as HTMLElement);
            }
        }

        this.$controlsWrapper.forEach(controls => {
            // Contolls
            if (this.$controlsWrapper) {
                const $edits = controls.querySelectorAll<HTMLElement>(`.${CssSelectors.EditControl}`);
                const $showComments = controls.querySelectorAll<HTMLElement>(`.${CssSelectors.ShowCommentsControl}`);
                const $Replys = controls.querySelectorAll<HTMLElement>(`.${CssSelectors.ReplyControl}`);
                const $likes = controls.querySelectorAll<BoxInputHTMLElement>(`.${CssSelectors.LikeControl}`);
                const $dislikes = controls.querySelectorAll<BoxInputHTMLElement>(`.${CssSelectors.DislikeControl}`);

                $edits.forEach($edit => {
                    $edit.addEventListener('click', this.onEdit.bind(this));
                });

                $showComments.forEach($showComment => {
                    $showComment.addEventListener('click', this.onShowComments.bind(this));
                });

                $Replys.forEach($Reply => {
                    $Reply.addEventListener('click', this.onReply.bind(this));
                });

                $likes.forEach($like => {
                    $like.addEventListener<'click'>('click', (e) => {
                        this.onLike(e);

                        $dislikes.forEach($dislike => {
                            $dislike.instance && $dislike.instance.deactivate();
                        });
                    });
                });

                $dislikes.forEach($dislike => {
                    $dislike.addEventListener<'click'>('click', e => {
                        this.onDislike(e);

                        $likes.forEach($like => {
                            $like.instance && $like.instance.deactivate();
                        });
                    });
                });
            }
        });

    }

    private setState(newState) {
        this.state = Object.assign({}, this.state, newState);
    }

    private onEdit(e: Event) {
        e.preventDefault();
        console.log('click edit');

        if (this.state.edit) {
            this.setState({ edit: false });
        }
        else {
            this.setState(commentsStateMachine.edit);
        }

        this.updateView();
    }

    private onShowComments(e: Event) {
        e.preventDefault();
        console.log('click show comments');

        if (this.state.showComments) {
            this.setState({ showComments: false });
        }
        else {
            this.setState(commentsStateMachine.showComments);
        }

        this.updateView();
    }

    private onReply(e: Event) {
        e.preventDefault();
        console.log('click reply');

        if (this.state.replay) {
            this.setState({ replay: false });
        }
        else {
            this.setState(commentsStateMachine.replay);
        }

        this.updateView();
    }

    private onLike(e: Event) {
        e.preventDefault();
        console.log('click like');

        // TODO: send request to like
    }

    private onDislike(e: Event) {
        e.preventDefault();
        console.log('click dislike');

        // TODO: send request to dislike
    }

    private updateView() {

        // Edit
        if (this.state.edit) {

            // Додати contenteditable для body
            if (this.$body) {
                this.$body.setAttribute('contenteditable', 'true');
            }

            // Показати control save та сховати інші контроли
            this.$controlsWrapper.forEach(controls => {
                controls.classList.add('--edit');
            });
        }
        else {

            // Додати contenteditable для body
            if (this.$body) {
                this.$body.removeAttribute('contenteditable');
            }

            // Показати control save та сховати інші контроли
            this.$controlsWrapper.forEach(controls => {
                controls.classList.remove('--edit');
            });
        }

        // Show comment
        if (this.state.showComments) {
            // Показати список
            if (this.$replyList) this.$replyList.classList.remove('hide');
            this.$controlsWrapper.forEach(controls => {
                controls.classList.add('--show-comment');
            });
        }
        else {
            // Сховати список
            if (this.$replyList) this.$replyList.classList.add('hide');

            this.$controlsWrapper.forEach(controls => {
                controls.classList.remove('--show-comment');
            });
        }

        // Reply
        if (this.state.replay) {
            if (this.$leaveComment) {
                this.$leaveComment.classList.remove('hide');

                const input = this.$leaveComment.querySelector<HTMLElement>('input[name="message"]');
                input && input.focus();
            }
            this.$controlsWrapper.forEach(controls => {
                controls.classList.add('--reply');
            });
        }
        else {
            if (this.$leaveComment) this.$leaveComment.classList.add('hide');
            this.$controlsWrapper.forEach(controls => {
                controls.classList.remove('--reply');
            });
        }

        if(typeof this._config.onChange === 'function') {
            this._config.onChange();
        }
    }
}
