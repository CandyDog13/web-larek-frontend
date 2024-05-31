import { IBasket } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export class Basket extends Component<IBasket> {
    protected _listProducts: HTMLElement;
    protected _totalPrice: HTMLSpanElement;
    protected buttonSubmit: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._listProducts = ensureElement<HTMLElement>('.basket__list', container);
        this._totalPrice = ensureElement<HTMLSpanElement>('.basket__price', container);
        this.buttonSubmit = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.buttonSubmit.addEventListener('click', () => this.events.emit('modal-order:open'))
    }

    set listProducts(cards: HTMLElement[]) {
        this._listProducts.replaceChildren(...cards)
    }

    set total(price: number) {
        this.setText(this._totalPrice, price.toString() + ' Синапсов');
    }

    set checkEmptyBasket(value: boolean) {
        this.buttonSubmit.disabled = value;
    }
}