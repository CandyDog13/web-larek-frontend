import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/data/basketModel';
import { ProductList } from './components/data/productList';
import { OrderData } from './components/data/orderData';
import './scss/styles.scss';
import { SuccessData } from './components/data/successData';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Product } from './components/view/product';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProductCatalog, IProduct, TProductMainPage, TId, TPayment } from './types/index'
import { ProductCatalog } from './components/view/productCatalog';
import { ProductPreview } from './components/view/productPreview';
import { ProductBasket } from './components/view/productBasket';
import { MainPage } from './components/view/mainPage';
import { Modal } from './components/view/modal';
import { Basket } from './components/view/basket';
import { OrderForm } from './components/view/orderForm';


// "Экземпляр класса EventEmitter"
const events = new EventEmitter();

// Модель данных:
const productsList = new ProductList(events);
const orderData = new OrderData(events);
const basketData = new BasketModel(events);
const successData = new SuccessData(events);

// Работа с Api 

const api = new AppApi(CDN_URL, API_URL);


// Получение продуктов с сервера
api.getProducts().then((data) => {
    productsList.products= data;
    // console.log(productsList)
}).catch(console.error)

// Поиск необходимых темплейтов
const mainPageContainer = ensureElement<HTMLElement>('.page');
const modalContainer = ensureElement<HTMLDivElement>('#modal-container');
const templateProductCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const templateProductPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const templateProductBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
const templateOrderForm = ensureElement<HTMLTemplateElement>('#order');

// Создание классов отображения
const mainPage = new MainPage(mainPageContainer, events);
const modal = new Modal(modalContainer, events);
const productPreview = new ProductPreview(cloneTemplate(templateProductPreview), events);
const productBasket = new ProductBasket(cloneTemplate(templateProductBasket), events);
const basket = new Basket(cloneTemplate(templateBasket),events);
const orderForm = new OrderForm(cloneTemplate(templateOrderForm), events);

//Реакция на изменения данных в каталоге products: changed
events.on('products:changed', (products:IProduct[])=>{
    const productList = products.map((item)=>{
        const product = new ProductCatalog<TProductMainPage>(cloneTemplate(templateProductCatalog), events);
        // console.log(product)
         console.log(item)
        return product.render(item);
        
    });
    mainPage.render({catalog:productList});
    // console.log(productList)
})

// Открытие предпросмотра товара по клику на главном экране
events.on('modal-preview: open',(id:TId) => {
    const previewData = productsList.getProductById(id.id);
    console.log(productsList.products);
    console.log(previewData.image)
    if (previewData) {
        modal.render({content: productPreview.render({...previewData, checkPrice:Boolean(previewData.price), stateTitleButton: basketData.checkProduct(previewData.id)})});
        modal.open();
    }
});

// Открытие корзины товаров с главного экрана
events.on('modal-basket:open', ()=>{
    modal.render({content:basket.render({ total: basketData.calculatePrice(), checkEmptyBasket: (basketData.checkLength() === 0)})});
    modal.open();
})

// console.log(previewData)

// Добавление товара в корзину
events.on('product:add', (id:TId)=>{
    basketData.addProduct(productsList.getProductById(id.id));
})

// Убираем товар из корзины
events.on('product:delete', (id:TId)=> {
    basketData.removeProduct(id.id);
    console.log(basketData)
})

// Изменяя корзину, необходимо заново ее составить

events.on('product:changed', (id:TId)=>{
    productPreview.render({checkPrice:true, stateTitleButton: basketData.checkProduct(id.id)});
    mainPage.render({basketCounter: basketData.checkLength()});
    const productsInBasket = basketData.items.map((item, index)=>{
        const card = new ProductBasket(cloneTemplate(templateProductBasket), events);
        return card.render({...item, index:index+1});
    })
    basket.render({listProducts: productsInBasket, total: basketData.calculatePrice(), checkEmptyBasket: (basketData.checkLength()===0)})
})

// Нажав в корзине "Оформить" заполняем массив товаров и открываем модалку с методом оплаты и адресом

events.on('modal-order:open', () => {
    orderData.setOrderProduct({total:basketData.calculatePrice(), items:basketData.getIdListProducts()});
    modal.render({content:orderForm.render({valid:orderForm.getValid()})});
})

events.on('order:valid', ()=>{
    orderData.setUserPayAddress({address:orderForm.address, payment: orderForm.payment});
})





// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    mainPage.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    mainPage.locked = false;
});

events.onAll((event)=> {
    console.log(event.eventName, event.data);
})