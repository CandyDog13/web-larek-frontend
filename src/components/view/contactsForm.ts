import { IContactsForm, IFormState } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Form } from "./form";
import { IEvents } from "../base/events";

export class ContactsForm extends Form<IFormState> implements IContactsForm {

    protected inputEmail: HTMLInputElement;
    protected inputPhone: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events); 
        this.inputEmail = ensureElement<HTMLInputElement>('input[name=email]', container);
        this.inputPhone = ensureElement<HTMLInputElement>('input[name=phone]', container);
        this.inputEmail.addEventListener('input', ()=> this.valid);
        this.inputPhone.addEventListener('input', ()=> this.valid);
    }

    get email() {
        return this.inputEmail.value;
    }

    get phone() {
        return this.inputPhone.value
    }

    get valid() {
        if(Boolean(this.inputEmail.value) && Boolean(this.inputPhone.value)) {
            this.error='';
            super.valid=true;
            return true
        } else  if (!this.inputEmail.value && Boolean(this.inputPhone.value)) {
            this.error='Укажите адрес электронной почты';
            super.valid=false;
            return false;
        } else if (Boolean(this.inputEmail.value) && !this.inputPhone.value) {
            this.error='Укажите номер телефона';
            super.valid=false;
            return false;
        } else {
            this.error='Укажите адрес электронной почты и номер телефона';
            super.valid=false;
            return false;
        }
    }

    set valid(value:boolean) {
        super.valid=value;
    }

}