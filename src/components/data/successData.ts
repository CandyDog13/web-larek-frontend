import { IEvents } from "../base/events";
import { TSuccessData, ISuccessData } from "../../types";

export class SuccessData implements ISuccessData {
    protected _orderSuccess: TSuccessData;
    events: IEvents;
  
    constructor(events: IEvents) {
      this.events = events;
    }
  
    set orderSuccess (data: TSuccessData) {
      this._orderSuccess = data;
      this.events.emit('success:changed', this._orderSuccess)
    }
  
    get orderSuccess() {
      return this._orderSuccess;
    }
  }