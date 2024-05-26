import { IMainPage } from "../../types";
import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

export class MainPage extends Component<IMainPage> implements IMainPage {
    protected _catalog: HTMLElement;
    protected buttonBasket: HTMLButtonElement;
    protected _basketCounter: HTMLSpanElement;
    protected _wrapper: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this._catalog = ensureElement<HTMLElement>('.gallery', container);
        this.buttonBasket = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._basketCounter = ensureElement<HTMLSpanElement>('.header__basket-counter', this.buttonBasket);
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this.buttonBasket.addEventListener('click', () => events.emit('modal-basket:open'));
    }
    
       set catalog(cards: HTMLElement[]) {
          this._catalog.replaceChildren(...cards)
       }
    
       set basketCounter(value: number) {
          this._basketCounter.textContent = String(value);
       }

       set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}