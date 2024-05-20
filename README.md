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
    _id: string;
}
```

Покупатель

```
export interface IUser {
    payment: string;
    address: string;
    email: string;
    number: string;
}

```

Отправка заказа

```
export interface IOrder {
    _id: string;
    total: number;
}
```

Модель для хранения листа товаров

```
export interface IProductList {
    products: IProduct[];
    total: number;
    preview: string | null;
    
}
```
Описание корзины

```
export interface IBasketModel {
    totalOrder:TOrderTotal;
    items: Map<string, number>;
```

Данные товара, используемые на главном экране

```
export type TProductMainPage = Pick<IProduct, 'title' | 'price' | 'image' | 'category'>
```

Данные финальной суммы заказа

```
export type TOrderTotal = Pick<IOrder, 'total'>
```

Данные, необходимые для формирования корзины

```
export type TBasket = Pick<IProduct, 'title'| 'price'> & TOrderTotal>
```

Данные покупателя в форме заполнения адреса и способа оплаты

```
export type TUserPayAddress = Pick<IUser, 'address' | 'payment'>
```

Данные покупателя в форме заполнения электронной почты и телефона

```
export type TUserEmailTelephone = Pick<IUser, 'email' | 'number'>
```

## Архитектура приложения

Код приложения разделен на стои согласно парадигме MVP(Model, View, Presenter):
- слой представления View отвечает за отображение данных на странице;
- слой данных Model отвечает за хранение и изменение данных;
- слой презентера отвечает за связь представления и данных между собой;

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.  
Методы:
- `get` - выполняет GET запрос на переданный в параметрах endpoint и возвращает promise с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на endpoint переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter 

Брокер событий позволяет отправить события и подпиываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации события.
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие;
- `emit`- инициализация события;
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие;

### Слой данных

#### Класс ProductList

Класс отвечает за хранение товаров на главной странице и просмотр отдельных товаров  
Конструктор класса принимает инстант брокера событий  
В полях класса хранятся следующие данные:
- `_products: IProduct[];` - массив объектов товаров;
- `total: number;` - общее количество товаров;
- `preview: string | null;` - id товара, который необходимо открыть в модальном окне
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Также класс имеет метод для работы с данными.  
`setProducts(products:IProduct[]):void;` - для загрузки из Api на страницу 
`getProduct(productId:string): IProduct;` - возвращает товар по его id.\
а также сеттеры и геттеры для сохранения и получения данных полей

#### Класс BasketModel

Класс отвечает за хранение данных корзины товаров и работу с товарами в корзине\
Конструктор класса принимает инстанты брокера событий\
В полях хранятся следующие данные:
- `_totalOrder:TOrderTotal;` - значение суммы заказов
- `_items: Map<string, number>;` - список заказов
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Методы взаимодействия: 
- `addProduct(id:string):void;` - добавление нового товара в список заказов
- `removeProduct(id:string):void;` - удаление товара из списка заказов
- `clear():void;` - очистка списка товаров (очистка корзины товаров)

#### Класс UserData

Класс отвечает за хранение данных о покупателе и позволяет работать с этими данными\
Конструктор класса принимает инстант брокера событий
В полях класса хранятся данные:
- `payment: string;` - параметр вида оплаты
- `address: string;` - адрес доставки
- `email: string;` - электронная почта для заказа
- `number: string;` -  номер телефона покупателя
- `events: IEvents` - экземпляр класса `EventEmitter` для инициализации событий при изменении данных.

Также в классе присутстуют методы для работы с данными:

- `setUserPayAddress(userData:TUserPayAddress):void;` - метод позволяет сохранить данные об адресе и методе оплаты
- `setUserEmailPhone(userData:TUserEmailTelephone):void;` - метод позволяет сохранить данные о номере телефона и адресе электронной почты покупателя
- `checkUserValidation(data:Record<keyof IUser, string>):boolean;` - проверка на валидность введенных значений

### Классы представления
Все классы представления отвечают за отображение внутри контейнета (DOM - элемент) передаваемых в них данных

#### Класс Modal
Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модельного окна. Устанавливает слушатели для закрытия модального окна.
- `constructor(selector: string, events: IEvents)` Конструктор принимает селктор, по которому в разметрке страницы будет идентифицировано модальное окно и экземпляр класса `EventEmitter` для возможности инициализации события.

Поля класса:
- `modal: HTMLElement` - элемент модального окна
- `events: IEvents` - брокер событий 

#### Класс ModalBasket
Реализует заполнение корзины товаров и расчет финальной суммы. Все свойства работы модального окна настедует от `Modal`.
При открытии корзины отображет товары и вещает обработчики событий на кнопки товаров.

Поля класса:
- `productIndex: HTMLSpanElement;` - номер товара в списке покупок
- `productTitle: HTMLSpanElement;` - название товара
- `productPrice: HTMLSpanElement;` - цена товара
- `deleteButton: HTMLButtonElement;` - кнопка удаления товара из корзины
- `buttonSubmit: HTMLButtonElement;` - кнопка оформления заказа
- `totalPrice: HTMLSpanElement;` - отображение суммы заказа

Методы:
`render(data:TBasket[]):void` - метод отображения товаров в корзине и суммы заказа

#### Класс ModalProduct
Расширение для Modal. Реализует отображение подробного описания продукта.
При открытии позволяет посмотреть подробную информацию и добавить в корзину.

Поля класса:
- `image: HTMLElement` - изображение товара
- `category: HTMLSpanElement`- категория
- `title: HTMLElement` - название
- `text: HTMLElement` - описание
- `buttonBasket: HTMLButtonElement` - кнопка добавления в корзину
- `price: HTMLSpanElement` - цена товара

Методы:
`render(data:Iproduct):void` - метод отображения товара

#### Класс ModalInfoPayAddress
Расширение класса Modal. Реализует отображение выбора способа оплаты и поля адреса доставки.
Позволяет выбрать способ оплаты и ввести адрес доставки. При самбите инициализирует событие передавая в него объект с данными из поля формы. При изменении данных в поле ввода инициализирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки далее.

Поля класса:
- `buttonSubmit: HTMLButtonElement` - кпопка "Далее"
- `_form: HTMLFormElement` - элемент формы
- `buttonOrder: HTMLButtonElement` - кнопка выбора способа оплаты

Методы:
- `setValid(isValid:boolean):void` - изменяет активность кнопки далее
- `getInputValue(): string` - возвращает данные из поля формы
- `close():void` - при закрытии очищает поля формы
- `get form: HTMLElement` - геттер для получения элемента формы


#### Класс ModalInfoEmailPhone

Расширение класса Modal. Реализует модальное окно с формой полей ввода информации о телефоне и электронной почте. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных в поля ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.  
Поля класса:
- `inputs: NedeListOf<HTMLInputElement>` - коллекция полей ввода формы
- `submitButton: HTMLButtonElement` - кпопка подтверждения
- `_form: HTMLFormElement`- элемент формы
- `formName:string` - значение атрибута name формы
- `errorsP Record<string, HTMLElement>` - объект хранящий все элементы для вывода ошибок под полями формы.

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем
- setInputValues(data: Record<string, string>): void - принимает объект с данными для заполнения полей формы
- setError(data: { field: string, value: string, validInformation: string }): void - принимает объект с данными для отображения или сокрытия текстов ошибок под полями ввода
- showInputError (field: string, errorMessage: string): void - отображает полученный текст ошибки под указанным полем ввода
- hideInputError (field: string): void - очищает текст ошибки под указанным полем ввода
- close (): void - расширяет родительский метод дополнительно при закрытии очищая поля формы и деактивируя кнопку сохранения
- get form: HTMLElement - геттер для получения элемента формы

#### Класс ModalSuccess
Класс расширяет Modal. Отвечает за отображение успешного оформления заказа. Принимает значение финальной цены и отображает в модальном окне.

Поля класса:
- `totalOrder: number;` - финальная цена
- `totalString: string;` - текст с указанием финальной цены.

Методы: 
- `render(totalString:string):void` - отображение финального окна подтвержденея

#### Класс Product
Отвечает за отображение товара, задавая в товаре данные названия, изображения, описания, категории и стоимости. Класс используется для отображения товаров на странице сайта. В конструктор класса передается DOM элемент темплейта, что позволяет при необходимости формировать товаров разных вариантов верстки. В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов товаров. Конструктор, кроме темплейта принимает экземпляр EventEmitter для инициации событий.\
Методы:
- setData(productData: IProduct): void - заполняет атрибуты элементов продукта данными.
- render(): HTMLElement - метод возвращает полностью заполненный товар
- геттер id возвращает уникальный id карточки

#### Класс ProductsContainer
Отвечает за отображение блока с товарами на главной странице. Предоставляет метод сеттер container для полного обновления содержимого на странице. В конструктор принимает контейнер, в котором размещаются карточки.

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
- product: previewClear - необходима очистка данных выбранной для показа в модальном окне товара

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- modal:open - открытие модального окна
- modal:close - закрытие модального окна
- success:open - открытие окна успешного оформелния заказа
- success:close - закрытие окна успешного оформления заказа
- card-preview:open - открытие модального окна предпросмотра карточки
- basket:open - открытие корзины
- basket:close - закрытие корзины
- order:open - открытие модального окна выбора оплаты и адреса
- order:submit - сохранение данных об оплате и адресе
- order:validation - валидация формы оплаты и адреса
- order:close - закрытие модального окна оплаты и адреса
- contacts:open - открытие модального окна с контактами
- contacts:submit - сохранение данных контактов
- contacts:validation - валидация формы контактов
- contacts:close - закрытие формы контактов
- product:add - добавление товара в корзину
- product:delete - удаление товара из корзины
- product:select - выбор товара для показа его превью