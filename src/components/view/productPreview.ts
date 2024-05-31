import { IProductPreview } from "../../types";
import { IEvents } from "../base/events";
import { Product } from "./product";
import { cloneTemplate, ensureElement } from "../../utils/utils";

export class ProductPreview extends Product<IProductPreview> implements IProductPreview {

    protected _description: HTMLElement;
    protected buttonBuyRemove: HTMLButtonElement;
    protected _image:HTMLImageElement;
    protected _category: HTMLSpanElement;

    // Одним из вариантов можно брать и расширять класс productCatalog
    // Количество дублирующегося кода сократится, но в перспективе, если изменится вид каталога, то превью будет зависимым
    // поэтому воизбежании таких зависимостей дублируется код

    constructor(container:HTMLElement, events: IEvents) {
        super(container,events);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLSpanElement>('.card__category', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this.buttonBuyRemove = ensureElement<HTMLButtonElement>('.card__button', container);
        this.buttonBuyRemove.addEventListener('click', ()=> {
            if (this.buttonBuyRemove.textContent === 'В корзину') {
                this.events.emit('product:add', {id: this.id})
            }
            else {this.events.emit('product:delete', {id: this.id})}
        })
    }
    set image(src: string) {
        this.setImage(this._image,src,this.title);
    }

    set description(value: string) {
        this.setText(this._description,value);
    }

    get description() {
        return this._description.textContent ?? '';
    }

    set category(value: string) {
        this.setText(this._category, value);
        this.addCategoryClass(value)
    }
    
    get category() {
        return this._category.textContent ?? '';
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

    get checkPrice() {
        return this.buttonBuyRemove.disabled;
    }

    set stateTitleButton(value:boolean) {
        if(value) {
            this.buttonBuyRemove.textContent = "Убрать из корзины"
        } else {
            this.buttonBuyRemove.textContent  = "В корзину"
        }
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