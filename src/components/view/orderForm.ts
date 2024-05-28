import { IOrderForm, TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "./form";

export class OrderForm extends Form<IOrderForm> implements IOrderForm {
    protected cardPayButton: HTMLButtonElement;
    protected cashPayButton: HTMLButtonElement;
    protected inputAddress: HTMLInputElement;


    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.cardPayButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.cashPayButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this.inputAddress = ensureElement<HTMLInputElement>('input[name=address]', container);
        this.cardPayButton.addEventListener('click', (evt)=>{this.handleActive(evt)});
        this.cashPayButton.addEventListener('click', (evt)=>{this.handleActive(evt)});
        this.inputAddress.addEventListener('input', ()=> this.getValid());
    }   

    handleActive(evt:Event){
        const buttonActive = evt.target as HTMLButtonElement;
        this.removeActiveButtons();
        buttonActive.classList.add('button_alt-active');
        this.getValid()
    }

    removeActiveButtons() {
        this.cardPayButton.classList.remove('button_alt-active');
        this.cashPayButton.classList.remove('button_alt-active');
    }

    get payment() {
        if (this.cardPayButton.classList.contains('button_alt-active')) {
            return this.cardPayButton.name as TPayment;
        } else if (this.cashPayButton.classList.contains('button_alt-active')) {
            return this.cashPayButton.name as TPayment;
        }
        return null;
    }

    get address() {
        return this.inputAddress.value
      }

    getValid() {
        if(Boolean(this.inputAddress.value) && Boolean(this.payment)) {
            this.error='';
            this.valid=true;
        } else  if (!Boolean(this.inputAddress.value) && Boolean(this.payment)) {
            this.error='Укажите адрес';
            this.valid=false;
        } else if (Boolean(this.inputAddress.value) && !Boolean(this.payment)) {
            this.error='Укажите способ оплаты';
            this.valid=false;
        } else {
            this.error='Укажите способ оплаты и адрес';
            this.valid= false;
        }
    }
}