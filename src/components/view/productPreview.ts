import { IProductPreview } from "../../types";
import { IEvents } from "../base/events";
import { Product } from "./product";
import { cloneTemplate, ensureElement } from "../../utils/utils";

export class ProductPreview extends Product<IProductPreview> implements IProductPreview {

    protected _description: HTMLElement;
    protected buttonBuyRemove: HTMLButtonElement;
    protected _image:HTMLImageElement;

    constructor(container:HTMLElement, events: IEvents) {
        super(container,events);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this.buttonBuyRemove = ensureElement<HTMLButtonElement>('.card__button', container);
        this.buttonBuyRemove.addEventListener('click', ()=> {
            if (this.buttonBuyRemove.textContent === 'В корзину') {
                this.events.emit('basket:add', {id: this.id}
                )}
            else {this.events.emit('basket:delete', {id: this.id})}
        })
    }
    set image(src: string) {
        this.setImage(this._image,src,this.title);
        // this._image.src = src;
        // this._image.alt = this.title
    }

    set description(value: string) {
        this.setText(this._description,value);
    }

    get description() {
        return this._description.textContent ?? '';
    }

    set checkPrice(value: boolean) {
        if (!value) {
            this.buttonBuyRemove.disabled = !value;
            this.buttonBuyRemove.textContent = 'Купить нельзя';
        } else {
            this.buttonBuyRemove.disabled = !value;
            this.buttonBuyRemove.textContent = 'В корзину';
        }
    }
}