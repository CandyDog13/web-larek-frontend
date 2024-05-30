import { IProductCatalog } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Product } from "./product";
import { IEvents } from "../base/events";

export class ProductCatalog<T> extends Product<T> implements IProductCatalog {
    protected _image: HTMLImageElement;
    protected _category: HTMLSpanElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLSpanElement>('.card__category', container);
        this.container.addEventListener('click',()=> this.events.emit('modal-preview: open', {id: this.id}));
    }

    set image(src: string) {
        this.setImage(this._image,src,this.title);
    }
    
    set category(value: string) {
        this.setText(this._category, value);
        this.addCategoryClass(value)
    }
    
    get category() {
        return this._category.textContent ?? '';
    }

    protected addCategoryClass(value: string) {
        switch(value) {
            case 'софт-скил':
                this._category.classList.add('card__category_soft');
            break
            case 'дополнительное':
                this._category.classList.add('card__category_additional');
            break
            case 'хард-скил':
                this._category.classList.add('card__category_hard');
            break
            case 'кнопка':
                this._category.classList.add('card__category_button');
            break
            case 'другое':
                this._category.classList.add('card__category_other');
            break
        }
    }
}