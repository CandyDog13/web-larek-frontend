import { Component } from "../base/component";
import { TSuccess, ISuccess } from "../../types";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

export class Success extends Component<TSuccess> implements ISuccess { 
    protected buttonOrderSuccess: HTMLButtonElement;
    protected _description: HTMLParagraphElement;
  
    constructor(container: HTMLElement, events: IEvents) {
      super(container, events);
      this.buttonOrderSuccess = ensureElement<HTMLButtonElement>('.order-success__close', container);
      this._description = ensureElement<HTMLParagraphElement>('.order-success__description', container);
      this.buttonOrderSuccess.addEventListener('click', () => this.events.emit('success:confirm'))
    }
  
    set description(total: string) {
      this.setText(this._description, `Списано ${total} синапсов`);
    }
  }