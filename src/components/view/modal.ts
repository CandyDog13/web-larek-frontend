import { IModal } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export class Modal extends Component<IModal>  implements IModal {
    protected _content: HTMLElement;
    protected buttonClose: HTMLButtonElement;

    constructor(container: HTMLElement, events:IEvents) {
        super(container, events);
        this.buttonClose = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.buttonClose.addEventListener('click', () => this.close());
        this.container.addEventListener('mouseup', (event) => {
            if(event.target === event.currentTarget) {
                this.close();
            }
        });
        this._content = ensureElement<HTMLElement>('.modal__content', container);
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
    }

    set content(value: HTMLElement){
        this._content.replaceChildren(value);
    }
}