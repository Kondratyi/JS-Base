'use strict';
//Назначаем все кнопки с нужным классом в переменную buttonBuy
let buttonBuy = document.querySelectorAll('.products__item__button')
    //с помощью метода forEach перебираем полученную коллекцию кнопок buttonBuy
buttonBuy.forEach(function (btn) {
    //каждой кнопке bth назначаем слушателя события 'click' и действие event    
    btn.addEventListener('click', function (event) {
        //получаем данные, которые указали в дата-атрибутах кнопки
        //event(произошедшие событие - клик)->srcElement(элемент на котором произошло событие - кнопка на которую нажали)->dataset(список дата-атрибутов элемента)->id(конкретный дата-атрибут который нужно получить)    
        let id = event.srcElement.dataset.id;
        let price = event.srcElement.dataset.price;
        let name = event.srcElement.dataset.name;
        let image = event.srcElement.dataset.img;
        //передаём полученные дата-атрибуты в объект cart методом addProduct(метод создаём сами)        
        cart.addProduct({
            id: id
            , price: price
            , name: name
            , image: image
        });
    });
});
//создаём общий объект cart
let cart = {
    //создаём пустой объект products    
    products: {}, //создаём общий метод для создания продукта addProduct 
    //в виде объекта product сюда передаются дата-атрибуты, которые получили выше
    addProduct(product) {
        //вызываем методы для:
        //добавления продукта в объект products, в параметр записываем объект product полученный выше
        this.addProductToObject(product);
        //отрисовки продукта в корзине на странице, в параметр записываем объект product полученный выше
        this.renderProductInCart(product);
        //отображение общей суммы товаров в корзине
        this.renderTotalSum();
        //удаление одной ед. продукта из корзины
        this.addRemoveBtnsListeners();
    }, //создаём метод для добавления продуктов в объект products 
    addProductToObject(product) {
        //если продукт с таким id в объекте products не найден, то добавляем его в виде объекта с количеством count 1      
        if (this.products[product.id] == undefined) {
            this.products[product.id] = {
                price: product.price
                , name: product.name
                , count: 1
            }
        }
        else {
            //если в объекте products уже есть объект с таким id, то увеличиваем его количество(count) на 1
            this.products[product.id].count++;
        }
    }, //создаём метод renderProductInCart для отрисовки товара в корзине
    renderProductInCart(product) {
        //создаём переменную productExist и пытаемся добавить в неё элемент с количеством товара       
        let productExist = document.querySelector(`.productCount[data-id="${product.id}"]`);
        //если этот элемент уже существует, то увеличиваем его значение(количество товара) на 1 и прерываем дальнейшее выполнение функции        
        if (productExist) {
            productExist.textContent++;
            return;
        }
        //если элемента с количеством товара не существует(значение null), то создаём переменную с разметкой для товара        
        let productInCart = `
            <div class="cart__product">
            <img class="cart__product__img" src="${product.image}" alt="product_${product.id}">
            <div>${product.name}</div>
            <div>${product.price}</div>
            <div class="productCount" data-id="${product.id}">1</div>
            <button class="cart__product__remove" data-id="${product.id}">Удалить товар</button>
            </div>
        `;
        //Создаём переменную с классом корзины       
        let cart = document.querySelector('.cart');
        //Добавляем разметку на страницу в корзину        
        cart.insertAdjacentHTML("afterbegin", productInCart);
    }, //создаём метод для отображения общей суммы в корзине
    renderTotalSum() {
        //записывает в содержимое класса cart__total__price данные получившиеся в методе getTotalSum       
        document.querySelector('.cart__total__price').textContent = this.getTotalSum();
    }, //создаём метод для подсчета общей суммы
    getTotalSum() {
        let sum = 0;
        //перебираем свойства объекта products по ключу key циклом for...in
        //???без цикла сумма перизаписывается каждый раз при добавлении товара нового вида, но увеличивается ели товар уже есть в корзине???
        for (let key in this.products) {
            //уножаем цену товара на количество и прибавляем к сумме sum         
            sum += this.products[key].price * this.products[key].count;
        }
        return sum;
    }, //назначаем слушателей события на все кнопки 'удалить'
    addRemoveBtnsListeners() {
        //метод querySelectorAll создаёт массив из всех элементов с классом cart__product__remove(кнопок 'удалить')       
        let buttons = document.querySelectorAll('.cart__product__remove');
        //циклом for перебираем получившийся массив по его длине        
        for (let i = 0; i < buttons.length; i++) {
            //каждому элементу получившегося массива назначаем слушатель события
            //указываем this.removeProductListener(а не создаём анонимную), чтобы это была одна и та же функция при каждом повторе цикла, а не создавалось много одинаковых. Чтобы можно было удалять события.
            buttons[i].addEventListener('click', this.removeProductListener);
        }
    }, //создаём метод, который будет вызываться по событию(event) клика на кнопке 'удалить'
    removeProductListener(event) {
        //если здесь использовать this, то он будет указывать на саму кнопку 'удалить', а не на объект cart
        cart.removeProduct(event);
        //вызываем метод renderTotalSum, чтобы пересчитать и записать новую суммму
        cart.renderTotalSum();
    }, //метод для удаления товара из корзины на HTML странице и из объекта
    removeProduct(event) {
        //записываем в переменную id элемента на котором произошло событие event
        let id = event.srcElement.dataset.id;
        this.removeProductFromObject(id);
        this.removeProductFromCart(id);
    }, //удаление товара из корзины
    removeProductFromCart(id) {
        //присваиваем в переменную элемент в котором указывается количество товара
        let productToDel = document.querySelector(`.productCount[data-id="${id}"]`);
        //если количество товара равно 1, то удаляем родительский узел
        if (productToDel.textContent == 1) {
            productToDel.parentNode.remove();
        } //иначе уменьшаем количество товара на 1    
        else {
            productToDel.textContent--;
        }
    }, //удаление товара из объекта
    removeProductFromObject(id) {
        //если количество этого товара в объекте равно 1, то удаляем ссылку на этот продукт с помощью delete
        if (this.products[id].count == 1) {
            delete this.products[id];
        } //иначе уменьшаем количество этого товара в объекте на 1 
        else {
            this.products[id].count--;
        }
    }, 
};