import { IProductBasket } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Product } from "../view/product";

export class ProductBasket extends Product<IProductBasket> implements IProductBasket {
    protected _index: HTMLSpanElement;
    protected buttonProductDelete: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._index = ensureElement<HTMLSpanElement>('.basket__item-index', container);
        this.buttonProductDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
        this.buttonProductDelete.addEventListener('click', ()=> {
            events.emit('product:delete', {id:this.id});
        })
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }
}