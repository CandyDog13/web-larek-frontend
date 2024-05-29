import { IForm, IFormState } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";


export abstract class Form<T> extends Component<IFormState> implements IForm {
    protected submitFormButton: HTMLButtonElement;
    protected errorElement: HTMLElement;
    protected inputList: HTMLInputElement[];
    protected container: HTMLFormElement;
    
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.submitFormButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorElement = ensureElement<HTMLSpanElement>('.form__errors', container);
        // this.inputList = ensureAllElements<HTMLInputElement>('.form__input', container)

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }
    

    set valid(valid:boolean) {
        this.setDisabled(this.submitFormButton, !valid)
    }

    set error(value: string) {
		this.setText(this.errorElement, value);
	}

    reset() {
		this.container.reset();
	}

    render(data: Partial<T> & IFormState): HTMLElement {
        const {valid, ...otherFormData} = data;
        this.valid = valid;
        return super.render(otherFormData)
    }
}