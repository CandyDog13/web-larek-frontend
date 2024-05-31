import { ApiPostMethods } from "../components/base/api";

export interface IProduct {
    title: string;
    description: string;
    price: number | null;
    image: string;
    category: string;
    id: string;
}

export interface IOrderData {
    payment: TPayment;
    address: string;
    email: string;
    phone: string;
    items: string[];
    total: number;

    setUserPayAddress(userData:TUserPayAddress):void;
    setUserEmailPhone(userData:TUserEmailTelephone):void;
    setOrderProduct(userData:TOrderData):void;
    getOrder():TInfoOrder;
}

export interface IProductList {
    products: IProduct[];
    getProductById(productId:string): IProduct;
}

export interface IBasketModel {
    items: IProduct[];
    addProduct(product:IProduct):void;
    removeProduct(id:string):void;
    clear():void;
    calculatePrice(): number;
    checkProduct(id: string): boolean;
    checkLength(): number;
    getIdListProducts(): string[];
}

export interface ISuccessData {
    orderSuccess: TSuccessData;
}

export interface IAppApi {
    getProducts(): Promise<IProduct[]>;
    getProduct(id: string): Promise<IProduct>;
    postOrder(order: TInfoOrder): Promise<TSuccessData>;
}

export interface IProductView {
    id: string;
    title: string;
    price: string;
}

export interface IProductBasket {
    index: number;
}

export interface IProductCatalog {
    image: string;
    category: string;
}

export interface IProductPreview {
    image: string;
    description: string;
    checkPrice: boolean;
    stateTitleButton: boolean;
    category: string;
}

export interface IMainPage {
    catalog: HTMLElement[];
    basketCounter: number;
    locked: boolean;
}

export interface IModal {
    content: HTMLElement;
    open(): void;
    close(): void;
}

export interface IBasket {
    listProducts: HTMLElement[];
    checkEmptyBasket: boolean;
    total: number
}

export interface IForm {
    valid: boolean;
    error: string;
    reset(): void;
}

export interface IFormState {
    valid: boolean;
}

export interface IOrderForm{
    payment: TPayment;
    address: string;
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export interface ISuccess {
    description: string;
}

export type TProductMainPage = Omit<IProduct, 'description'>;

export type TUserPayAddress = Pick<IOrderData, 'address' | 'payment'>

export type TUserEmailTelephone = Pick<IOrderData, 'email' | 'phone'>

export type TOrderData = Pick<IOrderData, 'total' | 'items'>

export type TPayment = 'card' | 'cash'

export type TSuccessData = { id: string, total: number} 

export type TInfoOrder = Pick<IOrderData, 'payment' | 'address'| 'email' | 'phone'| 'total' | "items" >

export type TId = {id: string};

export type TSuccess = {description: string};