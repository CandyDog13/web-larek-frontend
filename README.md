# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных, используемые в приложении

Товар

```
export interface IProduct {
    title: string;
    description: string;
    price: number | null;
    image: string;
    category: string;
    id: string;
}
```

Данные заказа
```
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
    getOrder(): TInfoOrder;
}
```

Модель для хранения листа товаров

```
export interface IProductList {
    products: IProduct[];
    getProductById(productId:string): IProduct;
    
}
```
Описание модели корзины

```
export interface IBasketModel {
    items: IProduct[];
    addProcuct(product:IProduct):void;
    removeProduct(id:string):void;
}
```

Описание модели успешного оформления заказа
```
export interface ISuccessData {
    orderSuccess: TSuccessData;
}

```

Описание интерфейса получения данных через Api
```
export interface IAppApi {
    getProducts(): Promise<IProduct[]>;
    getProduct(id: string): Promise<IProduct>;
    postOrder(order: TInfoOrder): Promise<TSuccessData>;
}
```

Отображение товара
```
export interface IProductView {
    id: string;
    title: string;
    price: string;
}
```

Отображение товара в корзине
```

export interface IProductBasket {
    index: number;
}

```

Отображение товара в каталоге
```
export interface IProductCatalog {
    image: string;
    category: string;
}
```

Отображение превью товара
```
export interface IProductPreview {
    image: string;
    description: string;
    checkPrice: boolean;
    stateTitleButton: boolean;
    category: string;
}
```

Отображение интерфейса главной страницы
```
export interface IMainPage {
    catalog: HTMLElement[];
    basketCounter: number;
    locked: boolean;
}

```

Отображение модального окна
```
export interface IModal {
    content: HTMLElement;
    open(): void;
    close(): void;
}
```

Отображение модального окна корзины
```
export interface IBasket {
    listProducts: HTMLElement[];
    checkEmptyBasket: boolean;
    total: number
}
```

Отображение формы
```
export interface IForm {
    valid: boolean;
    error: string;
    reset(): void;
}
```

Валидация формы
```
export interface IFormState {
    valid: boolean;
}
```

Форма оплаты и адреса
```
export interface IOrderForm{
    payment: TPayment;
    address: string;
}
```

Форма заполнения контактов 
```
export interface IContactsForm {
    email: string;
    phone: string;
}
```

Модалка с информацией об успешном оформлении
```
export interface ISuccess {
    description: string;
}
```

Данные товара, используемые на главном экране

```
export type TProductMainPage = Omit<IProduct, 'description'>;
```

Данные покупателя в форме заполнения адреса и способа оплаты

```
export type TUserPayAddress = Pick<IUser, 'address' | 'payment'>
```

Данные покупателя в форме заполнения электронной почты и телефона

```
export type TUserEmailTelephone = Pick<IOrderData, 'email' | 'phone'>
```

Данные для заказа из корзины
```
export type TOrderData = Pick<IOrderData, 'total' | 'items'>
```

Выбор метода оплаты
```
export type TPayment = 'card' | 'cash'
```

Параметры данных успешного заказа
```
export type TSuccessData = { id: string, total: number} 
```

Данные с информацией для заказа
```
export type TInfoOrder = Pick<IOrderData, 'payment' | 'address'| 'email' | 'phone'| 'total' | "items" >
```

Получение id элемента
```
export type TId = {id: string};
```

Получение сообщения о потраченных синапсах
```
export type TSuccess = {description: string};
```

## Архитектура приложения

Код приложения разделен на стои согласно парадигме MVP(Model, View, Presenter):
- слой представления View отвечает за отображение данных на странице;
- слой данных Model отвечает за хранение и изменение данных;
- слой презентера отвечает за связь представления и данных между собой;

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.\
Поля класса:\
- `readonly baseUrl: string;` - базовый URL адрес ресурса для Api
- `protected options: RequestInit;` - объект настроек для формирования запроса\

Конструктор принимает параметры для заполнения полей класса.

Методы:
- `get` - выполняет GET запрос на переданный в параметрах endpoint и возвращает promise с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на endpoint переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter 

Брокер событий позволяет отправить события и подпиываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации события.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие;
- `emit`- инициализация события;
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие;\

#### Класс Component
Базовый компонент, который в конструкторе создает базовый элемент. Данный абстрактный класс служит шаблоном для других классов.

Поля:
- `container: HTMLElement` - контейнер с темплейтом
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Методы:
- `setDisabled` - блокировка элемента
- `setText` - установить текстовое содержимое
- `protected setImage(element: HTMLImageElement, src: string, alt?: string)` - установить изображение
- `render(data:Partial<T>):HTMLElement` - вернуть корневой DOM-элемент

### Слой данных

#### Класс ProductList

Класс отвечает за хранение товаров на главной странице и просмотр отдельных товаров  
Конструктор класса принимает инстант брокера событий  
В полях класса хранятся следующие данные:
- `protected _products: IProduct[];` - массив объектов товаров;
- `protected events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Также класс имеет метод для работы с данными, setter и getter. 
- `set products(products:IProduct[])`- записывает массив продуктов в _products и устанавливает значение для events.
- `get products()` - возвращает массив продуктов.
- `getProductById(productId:string): IProduct;` - возвращает товар по его id.\

#### Класс BasketModel

Класс отвечает за хранение данных корзины товаров и работу с товарами в корзине\
Конструктор класса принимает инстанты брокера событий\
В полях хранятся следующие данные:
- `_items: IProdict[]` - список заказов
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Методы взаимодействия: 
- `get items()` - получение массива товаров
- `addProduct(product:IProduct):void;` - добавление нового товара в список заказов
- `removeProduct(id:string):void;` - удаление товара из списка заказов
- `clear():void;` - очистка списка товаров (очистка корзины товаров)
- `calculatePrice():number` - вычисление общей суммы заказа в корзине
- `checkProduct(id:string):boolean` - определяет наличие товара в корзине по его id
- `checkLength():number` - определяет количество товаров в корзине
- `getIdListProducts():string[]` - выводит список с значениями id товаров, добавленных в корзину


#### Класс OrderData

Класс отвечает за хранение данных о покупателе и позволяет работать с этими данными\
Конструктор класса принимает инстант брокера событий
В полях класса хранятся данные:
- `protected payment: TPayment;` - параметр вида оплаты
- `protected _address: string;` - адрес доставки
- `protected _email: string;` - электронная почта для заказа
- `protected _phone: string;` -  номер телефона покупателя
- `protected _items: string[]` - список товаров в корзине
- `protected _total: number` - общая стоимость товаров в корзине
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Также в классе присутстуют методы для работы с данными, а также setter:

- `set payment(payment:TPayment)` - запись способа оплаты
- `set address(address:string)` - запись адреса покупателя
- `set email(email:string)` - запись электронной почты покупателя
- `set phone(phone:string)` - запись номера телефона покупателя
- `set items(items:string[])` - запись списка id товаров заказа
- `set total(total:number)` - запись суммы заказа
- `setUserPayAddress(userData:TUserPayAddress):void;` - метод позволяет сохранить данные об адресе и методе оплаты
- `setUserEmailPhone(userData:TUserEmailTelephone):void;` - метод позволяет сохранить данные о номере телефона и адресе электронной почты покупателя
- `setOrderProduct(userData:TOrderData)` - метод позволяет сохранить данные о сумме заказа и список id товаров
- `getOrder():TInfoOrder` - возвращает все данные о заказе

#### Класс SuccessData

Класс отвечает за данные, полученные с сервера после оформления заказа.

Поля класса:
- `protected _orderSuccess: TSuccessData` - данные о заказе
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Методы:

- `set orderSuccess(data:TSuccessData)` - сохранение данных с сервера о заказе
- `get orderSuccess()` - получение сохраненных данных о заказе

### Классы представления
Все классы представления отвечают за отображение внутри контейнета (DOM - элемент) передаваемых в них данных

#### Класс Product
Расширяет класс Component. Является абстрактным классом для составления отображений состояний карточек. Включает в себя общие поля карточек.
Конструктор заполняет элементы цены и имени товара.

Поля класса:
- `protected _title: HTMLHeadingElement` - HTML элемент, отвечающий за имя товара
- `protected _price: HTMLElement` - HTML элемент, отвечающий за отображение цены товара
- `protected _id: string` - id карточки выбранного товара

Методы:
- `set title(value:string)` - запись имени товара
- `get title()` - получение имени товара
- `set price(value:string)` - запись стоимости товара
- `get price()` - получение стоимости товара
- `set id(id:string)` - запись id товара
- `get id()` - получение id товара

#### Класс ProductBasket
Расширяет класс Product. Отвечает за отображение карточки в корзине.
Конструктор заполняет элементы отображения.  Добавляет слушатель на нажатие кнопки удаления.

Поля:
- `protected _index: HTMLSpanElement` - HTML элемент, отвечающий за индекс товара в корзине
- `protected buttonProductDelete: HTMLButtonElement` - HTML элемент, отвечающий за кнопку удаления карточки

Методы:
- `set index(value: number): void` - заполнение индекса в корзине

#### Класс ProductCatalog 
Расширяет класс Product. Отвечает за отображенние карточки товара в общем каталоге на главной странице. Конструктор принимает параметры Product и устанавлиает слушатель на открытие превью товара.

Поля:
- `protected _image: HTMLImageElement` - HTML элемент, отвечающий за изображение товара
- `protected _category: HTMLSpanElement` - HTML элемент, отвечающий за категорию товара

Методы: 
- `set image(src:string):void` - запись данных изображения товара
- `set category(value: string): void` - запись данных категории товара
- `get category(): string` - получение названия категории товара
- `protected addCategoryClass(value: string)` - метод для присвоения нужного цвета категории по ее названию посредством добавления определенного класса в css для html элемента.

#### Класс ProductPreview
Расширяет класс Product. Отвечает за отображение карточки товара в формате превью(открывается более подробная информация о товаре с возможностью добавления его в корзину). Конструктор принимает параметры Product, а также параметры изображения и описания товара. Также устанавливает слушатели на кнопку Добавления/Удаления товара с корзины.

Поля:
- `protected _description: HTMLElement` - HTML элемент, отвечающий за отображение описания товара
- `buttonBuyRemove: HTMLButtonElement` - HTML элемент, отвечающий за кнопку для покупки или удаления товара в корзине
- `protected _image: HTMLImageElement` - HTML элемент, отвечающий за отображение картинки товара в предпросмотре
- `protected _category: HTMLSpanElement` - HTML элемент, отвечающий за категорию товара

Методы:
- `set image(src:string):void` - запись данных изображения товара
- `set description(value: string): void` - запись данных подробного описания товара
- `get description(): string` - получение данных подробного описания товара
- `set checkPrice(value: boolean): void` - установка состояния кнопки с проверкой цены на наличие бесценных товаров
- `get checkPrice(): boolean` - получения состояния кнопки
- `set stateTitleButton(value:boolean)` - установка названия кнопки с проверкой наличия товара в корзине
- `set category(value: string): void` - запись данных категории товара
- `get category(): string` - получение названия категории товара
- `protected addCategoryClass(value: string)` - метод для присвоения нужного цвета категории по ее названию посредством добавления определенного класса в css для html элемента.
- `protected removeCssClasses(): void` - метод для очистки классов цветов для фона категорий

#### Класс MainPage
Расширяет класс Component. Служит для отображения корзины в шапке сайта и показа количества добавленных товаров в нее, также служит для отображения блока с товарами на главной странице.
Конструктор принимает значение контейнера главной страницы и устанавливает слушатель на открытие корзины.

Поля:

- `protected _catalog: HTMLElement` - контейнер для отображения товаров
- `protected buttonBasket: HTMLButtonElement` - HTML элемент, содержащий иконку корзины, при нажатии на которую открывается модальное окно с корзиной товаров
- `protected _basketCounter: HTMLSpanElement` - html элемент, показывающий количество добавленных товаров в корзину
- `protected _wrapper: HTMLElement` - html элемент, отвечающий за внутренннее содержимое страницы.

Методы:
- `set catalog(cards: HTMLElement[]):void` - записывает карточки в _catalog для отображения их на главной странице
- `set basketCounter(value: number):void` - записывает количество добавленных товаров в корзину
- `set locked(value: boolean):void` - данный метод служит для блокировки/разблокировки экрана, убирает прокрутку при открытии/закрытии модального окна

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модельного окна. Устанавливает слушатели для закрытия модального окна. Наследует базовый компонент `Component`
- `constructor(selector: string, events: IEvents)` Конструктор принимает селктор, по которому в разметрке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициализации события.

Поля класса:
- `modal: HTMLElement` - элемент модального окна
- `events: IEvents` - брокер событий

#### Класс Form
Реализует отображение елемента формы. Наследует базовый компонент `Component`.
`constructor(protected container: HTMLFormElement, protected events: IEvents)`
Конструктор принимает значения элемента формы и экземпляр класса `EventEmitter` для возможности инициализации события.
Поля класса:
- `submitFormButton: HTMLButtonElement;` - кнопка подтверждения
- `container: HTMLFormElement` - элемент формы
- `protected errorElement: HTMLElement` - элемент для отображения ошибок


Методы класса:
- `set valid(value: boolean)` - проверка на валидность
- `set error(value: string)` - установка текста ошибки
- `reset():void` - очищает форму
- `render(data: Partial<T> & IFormState): HTMLElement` - рендер для форм

#### Класс Basket
Расширяет класс Component. Отображает корзину с товарами в ней.
Конструктор принимает значения HTML элементов и устанавливает слушатель на нажатие кнопки оформления заказа.

Поля: 
- `protected _listProducts: HTMLElement` - html элемент, отвечающий за отображение списка товаров в корзине
- `protected _totalPrice: HTMLSpanElement` - html элемент, отвечающий за отображение общей стоимости товаров
- `protected buttonSubmit: HTMLButtonElement` - кнопка "Оформить"

Методы:
- `set listProducts(cards: HTMLElement[]):void` - устанавливает список карточек добавленных товаров в корзину
- `set total(price: number):void` - устанавливает общую стоимость товаров в html элемент _totalPrice
- `set checkEmptyBasket(value: boolean):void` - для блокировки кнопки "Оформить", если корзина пуста

#### Класс OrderForm
Реализует отображение выбора способа оплаты и поля адреса доставки.
Позволяет выбрать способ оплаты и ввести адрес доставки. При самбите инициализирует событие передавая в него объект с данными из поля формы. При изменении данных в поле ввода инициализирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки далее. Наследует класс `Form`

Поля класса:
- `protected cardPayButton: HTMLButtonElement` - кнопка оплаты онлайн
- `protected cashPayButton: HTMLButtonElement` - кнопка оплаты на месте
- `protected inputAddress: HTMLInputElement` - поле ввода адреса

Методы:
- `get payment():TPayment|null` - возвращает имя активной кнопки
- `set address(value: string)` - заполнение адреса
- `protected handleActive(evt:Event):void` - отклик на нажатие кнопок 
- `protected removeActiveButtons(): void` - очищает классы активности кнопок
- `get valid(): boolean` - возвращает валидность формы, проверяя кнопки и поле ввода
- `set valid(value:boolean): void` - устанавливает валидность для отображения кнопки

#### Класс ContactsForm
Реализует модальное окно с формой полей ввода информации о телефоне и электронной почте. При изменении данных в поля ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения. Наследует класс `Form`

Поля: 
- `protected inputEmail: HTMLInputElement` - текстовое поле для email
- `protected inputPhone: HTMLInputElement` - текстовое поле для номера телефона

Методы:   
- `set phone(value: string)` - заполнение телефона
- `set email(value: string)` - заполнение почты
- `get valid(): boolean` - возвращает валидность формы, проверяя поля ввода
- `set valid(value:boolean): void` - устанавливает валидность для отображения кнопки

#### Класс Success
Отвечает за отображение успешного оформления заказа. Принимает значение цены для для отображения описания с ценой в модальном окне. Наследует базовый компонент `Component`

Поля класса:
- `protected buttonOrderSuccess: HTMLButtonElement` - кнопка "за новыми покупками"
- `protected _description: HTMLParagraphElement` - показ потраченных средств при покупке 

    Метод:
- `set description(total: string): void` - устанавливает количество потраченных средств в html элемент _description.

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле index.ts, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В index.ts сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- products: changed - изменение массива товаров
- basket:changed - изменение корзины товаров
- success:changed - изменение модалки с успешной отправкой


*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- modal-preview: open - открытие модального окна предпросмотра
- modal-basket:open - открытие модального окна корзины
- product:add - добавление товара в корзину
- product:delete - удаление товара из корзины
- modal-order:open - открытие модального окна оплаты и адреса
- order:submit - сохранение данных об оплате и адресе и открытие модального окна контактов
- contacts:submit - сохранение данных контактов и отправка данных на сервер
- success:confirm - закрытие и очистка модального окна успешной отправки
- modal:open - открытие модального окна
- modal:close - закрытие модального окна