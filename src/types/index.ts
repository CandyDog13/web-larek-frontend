export interface IProduct {
    title: string;
    description: string;
    price: number;
    image: string;
    category: string;
    _id: string;
}

export interface IUser {
    payment: string;
    address: string;
    email: string;
    number: string;
}

export interface IOrder {
    _id: string;
    total: number;
}

export interface IProductList {
    products: IProduct[];
    total: number;
    preview: string | null;
    setProducts(products:IProduct[]):void;
    getProduct(productId:string): IProduct;

}

export interface IBasketModel {
    totalOrder:TOrderTotal;
    items: Map<string, number>;
    addProduct(id:string):void;
    removeProduct(id:string):void;
}

export interface IUserData {
    setUserPayAddress(userData:TUserPayAddress):void;
    setUserEmailPhone(userData:TUserEmailTelephone):void;
    checkUserValidation(data:Record<keyof IUser, string>):boolean;
}

export type TProductMainPage = Pick<IProduct, 'title' | 'price' | 'image' | 'category'>

export type TOrderTotal = Pick<IOrder, 'total'>

export type TBasket = Pick<IProduct, 'title'| 'price'> & TOrderTotal

export type TUserPayAddress = Pick<IUser, 'address' | 'payment'>

export type TUserEmailTelephone = Pick<IUser, 'email' | 'number'>