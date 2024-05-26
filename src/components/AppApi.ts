import { IAppApi, IProduct, TInfoOrder, TSuccessData } from "../types";
import { Api, ApiListResponse } from "./base/api";

export class AppApi extends Api implements IAppApi {

    protected cdnUrl: string;

    constructor(cdnUrl:string, baseUrl:string, options: RequestInit = {}) {
        super(baseUrl, options);
        this.cdnUrl = cdnUrl;
    }

    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((items:ApiListResponse<IProduct>)=> {
            return items.items.map((item) => { return {...item, image: this.cdnUrl + item.image}})
        })
    }

    getProduct(id:string): Promise<IProduct> {
        return this.get('/product/'+id).then((item:IProduct)=>{
            return {...item, image: this.cdnUrl+item.image}
        })
    }
    
    postOrder(order: TInfoOrder): Promise<TSuccessData> {
        return this.post('/order', order).then((answer: TSuccessData) => {
          return answer
        })
    }
}