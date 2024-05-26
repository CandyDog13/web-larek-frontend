import { IProductView } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

export abstract class Product<T> extends Component<T> implements IProductView {
    protected _title: HTMLHeadingElement;
    protected _price: HTMLElement;
    protected _id: string;

    constructor(container: HTMLElement, events:IEvents) {
        super(container, events);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._title = ensureElement<HTMLHeadingElement>('.card__title', container);
    }

    set title(value:string) {
        this.setText(this._title, value);
    }

    get title() {
        return this._title.textContent ?? ''
      }

    set price(value:string) {
        this.setText(this._price, value ? `${value} синапсов` : `Бесценно`);
    }

    get price() {
        return this._price.textContent ?? '';
    }

    set id(id:string) {
        this._id=id;
    }

    get id() {
        return this._id;
    }
}