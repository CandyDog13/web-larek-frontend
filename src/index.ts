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
import { IProductCatalog, IProduct, TProductMainPage, TId } from './types/index'
import { ProductCatalog } from './components/view/productCatalog';
import { ProductPreview } from './components/view/productPreview';
import { ProductBasket } from './components/view/productBasket';
import { MainPage } from './components/view/mainPage';
import { Modal } from './components/view/modal';

const LocalProductList = {
    "total": 10,
    "items": [
        {
            "id": "854cef69-976d-4c2a-a18c-2aa45046c390",
            "description": "Если планируете решать задачи в тренажёре, берите два.",
            "image": "/5_Dots.svg",
            "title": "+1 час в сутках",
            "category": "софт-скил",
            "price": 750
        },
        {
            "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
            "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
            "image": "/Shell.svg",
            "title": "HEX-леденец",
            "category": "другое",
            "price": 1450
        },
        {
            "id": "b06cde61-912f-4663-9751-09956c0eed67",
            "description": "Будет стоять над душой и не давать прокрастинировать.",
            "image": "/Asterisk_2.svg",
            "title": "Мамка-таймер",
            "category": "софт-скил",
            "price": null
        },
        {
            "id": "412bcf81-7e75-4e70-bdb9-d3c73c9803b7",
            "description": "Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.",
            "image": "/Soft_Flower.svg",
            "title": "Фреймворк куки судьбы",
            "category": "дополнительное",
            "price": 2500
        },
        {
            "id": "1c521d84-c48d-48fa-8cfb-9d911fa515fd",
            "description": "Если орёт кот, нажмите кнопку.",
            "image": "/mute-cat.svg",
            "title": "Кнопка «Замьютить кота»",
            "category": "кнопка",
            "price": 2000
        },
        {
            "id": "f3867296-45c7-4603-bd34-29cea3a061d5",
            "description": "Чтобы научиться правильно называть модификаторы, без этого не обойтись.",
            "image": "Pill.svg",
            "title": "БЭМ-пилюлька",
            "category": "другое",
            "price": 1500
        },
        {
            "id": "54df7dcb-1213-4b3c-ab61-92ed5f845535",
            "description": "Измените локацию для поиска работы.",
            "image": "/Polygon.svg",
            "title": "Портативный телепорт",
            "category": "другое",
            "price": 100000
        },
        {
            "id": "6a834fb8-350a-440c-ab55-d0e9b959b6e3",
            "description": "Даст время для изучения React, ООП и бэкенда",
            "image": "/Butterfly.svg",
            "title": "Микровселенная в кармане",
            "category": "другое",
            "price": 750
        },
        {
            "id": "48e86fc0-ca99-4e13-b164-b98d65928b53",
            "description": "Очень полезный навык для фронтендера. Без шуток.",
            "image": "Leaf.svg",
            "title": "UI/UX-карандаш",
            "category": "хард-скил",
            "price": 10000
        },
        {
            "id": "90973ae5-285c-4b6f-a6d0-65d1d760b102",
            "description": "Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.",
            "image": "/Mithosis.svg",
            "title": "Бэкенд-антистресс",
            "category": "другое",
            "price": 1000
        }
    ]
}
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

// Создание классов отображения
const mainPage = new MainPage(mainPageContainer, events);
const modal = new Modal(modalContainer, events);
const productPreview = new ProductPreview(cloneTemplate(templateProductPreview), events);
const productBasket = new ProductBasket(cloneTemplate(templateProductBasket), events);

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
        modal.render({content: productPreview.render({...previewData, checkPrice:Boolean(previewData.price)})});
        modal.open();
    }
});

// console.log(previewData)






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