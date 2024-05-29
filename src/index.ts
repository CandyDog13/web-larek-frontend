import { EventEmitter } from './components/base/events';
import { BasketModel } from './components/data/basketModel';
import { ProductList } from './components/data/productList';
import { OrderData } from './components/data/orderData';
import './scss/styles.scss';
import { SuccessData } from './components/data/successData';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, TProductMainPage, TId, TSuccessData } from './types/index'
import { ProductCatalog } from './components/view/productCatalog';
import { ProductPreview } from './components/view/productPreview';
import { ProductBasket } from './components/view/productBasket';
import { MainPage } from './components/view/mainPage';
import { Modal } from './components/view/modal';
import { Basket } from './components/view/basket';
import { OrderForm } from './components/view/orderForm';
import { ContactsForm } from './components/view/contactsForm';
import { Success } from './components/view/success';


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
    productsList.products = data;
}).catch(console.error)

// Поиск необходимых темплейтов
const mainPageContainer = ensureElement<HTMLElement>('.page');
const modalContainer = ensureElement<HTMLDivElement>('#modal-container');
const templateProductCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const templateProductPreview = ensureElement<HTMLTemplateElement>('#card-preview');
const templateProductBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const templateBasket = ensureElement<HTMLTemplateElement>('#basket');
const templateOrderForm = ensureElement<HTMLTemplateElement>('#order');
const templateContactsForm = ensureElement<HTMLTemplateElement>('#contacts');
const templateSuccess = ensureElement<HTMLTemplateElement>('#success');

// Создание классов отображения
const mainPage = new MainPage(mainPageContainer, events);
const modal = new Modal(modalContainer, events);
const productPreview = new ProductPreview(cloneTemplate(templateProductPreview), events);
const basket = new Basket(cloneTemplate(templateBasket),events);
const orderForm = new OrderForm(cloneTemplate(templateOrderForm), events);
const contactsForm = new ContactsForm(cloneTemplate(templateContactsForm), events);
const success = new Success(cloneTemplate(templateSuccess), events);

//Реакция на изменения данных в каталоге products: changed
events.on('products:changed', (products:IProduct[])=>{
    const productList = products.map((item)=>{
        const product = new ProductCatalog<TProductMainPage>(cloneTemplate(templateProductCatalog), events);
        return product.render(item);
        
    });
    mainPage.render({catalog:productList});
})

// Открытие предпросмотра товара по клику на главном экране
events.on('modal-preview: open',(id:TId) => {
    const previewData = productsList.getProductById(id.id);
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

// Добавление товара в корзину
events.on('product:add', (id:TId)=>{
    basketData.addProduct(productsList.getProductById(id.id));
})

// Убираем товар из корзины
events.on('product:delete', (id:TId)=> {
    basketData.removeProduct(id.id);
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
    modal.render({content:orderForm.render({valid:orderForm.valid})});
})

// После заполнения формы нажимаем кнопку далее => сохраняем данные и рендерим следующую форму 
events.on('order:submit', ()=>{
    orderData.setUserPayAddress({address:orderForm.address, payment: orderForm.payment});
    modal.render({content:contactsForm.render({valid:contactsForm.valid})});
})

// Заполнив форму с контактами нажимаем далее => сохраняем данные и делаем запрос на сервер
events.on('contacts:submit', ()=> {
    orderData.setUserEmailPhone({email:contactsForm.email, phone:contactsForm.phone});
    const dataOrderInformation = orderData.getOrder();
    api.postOrder(dataOrderInformation).then((data:TSuccessData)=> {
        successData.orderSuccess=data;
        basketData.clear;
        orderForm.reset();
        contactsForm.reset();
    }).catch(console.error);
})

// Данные с сервера пришли => рендерим модалку успешного оформления
events.on('success:changed', (data: TSuccessData) => {
    modal.render({content: success.render({description: String(data.total)})})
});
  
// По нажатию кнопки модалка закрывается
events.on('success:confirm', () => {
    modal.close();
    modal.content=null;
})

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    mainPage.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    mainPage.locked = false;
});

// events.onAll((event)=> {
//     console.log(event.eventName, event.data);
// })