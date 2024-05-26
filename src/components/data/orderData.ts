import { TUserEmailTelephone, TUserPayAddress, IOrderData, TOrderData, TPayment } from "../../types";
import { IEvents } from "../base/events";
import { IProduct } from "../../types";

export class OrderData implements IOrderData {
    protected _payment: TPayment;
    protected _address: string;
    protected _email: string;
    protected _phone: string;
    protected _items: string[];
    protected _total: number;
    events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set payment(payment:TPayment) {
        this._payment = payment;
    }

    set address(address:string) {
        this._address = address;
    }

    set email(email:string) {
        this._email = email;
    }

    set phone(phone:string) {
        this._phone = phone;
    }

    set items(items:string[]) {
        this._items=items;
    }

    set total(total:number) {
        this._total=total;
    }

    setUserPayAddress(userData: TUserPayAddress): void {
        this.address=userData.address;
        this.payment=userData.payment;
    }

    setUserEmailPhone(userData: TUserEmailTelephone): void {
        this.email = userData.email;
        this.phone = userData.phone;
    }

    setOrderProduct(userData:TOrderData) {
        this.total = userData.total;
        this.items = userData.items;
    }

    getOrder() {
        return {
            payment: this._payment,
            email: this._email,
			phone: this._phone,
			address: this._address,
			total: this._total,
			items: this._items
        }
    }
}