import { IBasketModel, IProduct } from "../../types";
import { IEvents } from "../base/events";

export class BasketModel implements IBasketModel {
    _items: IProduct[];
    events: IEvents;

    constructor(events:IEvents) {
        this.events=events;
        this._items = [];
    }

    get items() {
        return this._items;
    }


    addProduct(product:IProduct) {
        if(!this._items.find((item)=> (item.id===product.id))) {
            this._items.push(product);
            this.events.emit('product:changed', {id: product.id});
        }
    }

    removeProduct(id: string): void {
        this._items=this._items.filter((item)=>(item.id!==id))
        this.events.emit('product:changed', {id});
    }

    clear() {
        this._items = [];
        this.events.emit('basket:changed');
    }

    calculatePrice() {
        return this._items.reduce((sum, item)=>sum+=item.price,0);
    }

    checkProduct(id: string) {
        return Boolean(this._items.find(product => product.id === id))
    }

    checkLength() {
        return this._items.length;
    }

    getIdListProducts() {
        return this._items.map(item => {
          return item.id
        })
      }
}