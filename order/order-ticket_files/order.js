/**********************
 general variable
 **********************/

// const baseUrl = 'https://chartertickets.com.ua';
// const baseUrl = 'http://65.21.55.95';
const baseUrl ='https://anytickets.com.ua';
const countriesList = [
    {data: '+380', co: 'ua', label: 'Україна'},
    {data: '+61', co: 'au', label: 'Австралія'},
    {data: '+43', co: 'at', label: 'Австрія'},
    {data: '+994', co: 'az', label: 'Азербайджан'},
    {data: '+35818', co: 'ax', label: 'Аландські о-ва'},
    {data: '+355', co: 'al', label: 'Албанія'},
    {data : '+213', co : 'dz', label: 'Алжир'}
];


let additionalData;
let formValid;
let isAdditionalData;
let isFormSent = true;
let isSendRepeat = false;
let isSendPayment = false;
let getAllAdditionalData = [];
let liqRes;
let tiketDiscount = null;
let usersArray = [];
let userOrdersSumm = {};
let movedToSecondStep = false;

const dataResultExpired = $('#page-info').data('result-expired-at') * 1000;
const oneDay = 1000 * 60 * 60 * 24;
const fiftyYears = oneDay * 366 * 50;
const hundredYears = oneDay * 366 * 100;
const dateToday = Date.now();

const flightID = $('#page-info').data('fly-property-to-id');
const lang = $('meta[name=lang]').attr('content');
const todayInput = stringifyInputDate(new Date(dateToday));
const tomorrowInput = stringifyInputDate(new Date(dateToday + oneDay));
const yesterdayInput = stringifyInputDate(new Date(dateToday - oneDay));
const minDataInput = stringifyInputDate(new Date(dateToday - fiftyYears));
const maxDataInput = stringifyInputDate(new Date(dateToday + fiftyYears));
const sendFormUrl = '/api/order/create-attempt';
const searchLink = $('#link_for_search').attr('href');
const paymentUrl = '/api/order/create-attempt-payment';
const ways = $('#ticket-ways').find('table .ticket-ones');
const serviceTypes = ['nutrition', 'baggages', 'places'];
const welcome = $('#page-info').data('show-welcome');


class User {
    constructor(ageType, birthday, citizenship, name, pasportCode, pasportLimitDate, sex, surname) {
        this['age-type'] = ageType;
        if (birthday) this.birthday = birthday;
        if (citizenship) this.citizenship = citizenship;
        if (name) this.name = name;
        if (pasportCode) this['pasport-code'] = pasportCode;
        if (pasportLimitDate) this['pasport-limit-date'] = pasportLimitDate;
        if (sex) this.sex = sex;
        if (surname) this.surname = surname;
    }
}

/**********************
 html
 **********************/

const phoneListHtml = `
    <div data-phone="{data_phone}" data-co="{co_phone}" class="country-phone-option" onclick="updatePhoneSelected(this)">
        <span>{data_phone}<img class="flag flag-{co_phone}" /></span>{phone_label}
    </div>
`

const passengerFormHTML = `
<div class="col-xs-12">
    <h3>${lajax.t('Пассажир')} №{pass_num} {pass_type}</h3>
</div>
<div class="col-md-3 col-sm-6">
    <label for="sex{pass_num}">${lajax.t('Пол')}</label>

    <select class="form-control untouched" id="sex{pass_num}" data-user-index="{pass_num}" data-order-type="sex">
        <option value=""> - </option>
        <option value="M">${lajax.t('Мужской')}</option>
        <option value="F">${lajax.t('Женский')}</option>
    </select>
    <span class="error-text" id="error-sex{pass_num}"></span>
</div>

<div class="col-md-3 col-sm-6">
    <label for="surname{pass_num}">${lajax.t('Фамилия')}</label>
    <span class="required">*</span>
    <input type="text" class="form-control untouched" id="surname{pass_num}"
        placeholder="${lajax.t('Латиницей с загран паспорта')}" onkeyup="this.value = inputKeyup(this.value)"
        data-user-index="{pass_num}" data-order-type="surname" 
    />
    <span class="error-text" id="error-surname{pass_num}"></span>
</div>

<div class="col-md-3 col-sm-6">
    <label for="name{pass_num}">${lajax.t('Имя')}</label>
    <span class="required">*</span>
    <input type="text" class="form-control untouched" id="name{pass_num}" placeholder="${lajax.t('Латиницей с загран паспорта')}"
    data-user-index={pass_num} data-order-type="name" onkeyup="this.value = inputKeyup(this.value)" />
    <span class="error-text" id="error-name{pass_num}"></span>
</div>

<div class="col-md-3 col-sm-6">
    <label for="birthday{pass_num}">${lajax.t('Дата рождения')}</label>
    <span class="required">*</span>
    <div class="input-group date datepicker-here"
        id="birthday-datepicker-{pass_num}"
    >
        <input type="text" class="form-control untouched" 
            id="birthday{pass_num}"
            data-user-index="{pass_num}"
            data-order-type="birthday"
        >
        <span class="input-group-addon">
            <i class="fa fa-calendar"></i>
        </span>
    </div>
    <span class="error-text" id="error-birthday{pass_num}"></span>
</div>

<div class="col-md-3 col-sm-6">
    <label for="citizenship{pass_num}">${lajax.t('Гражданство')}</label>
    <span class="required">*</span>
    <select id="citizenship{pass_num}" class="form-control untouched" size="1" data-user-index="{pass_num}" data-order-type="citizenship">
        <option value="" selected="selected">-- ${lajax.t('Выбрать страну')} --</option>
        {optionsCountries}
    </select>
    <span class="error-text" id="error-citizenship{pass_num}"></span>
</div>

<div class="col-md-3 col-sm-6">
    <label for="pasport-code{pass_num}">
        ${lajax.t('Серия и номер паспорта')}
        <span class="required">*</span>
    </label>
    <input type="text" class="form-control untouched" id="pasport-code{pass_num}" 
    data-user-index="{pass_num}" data-order-type="pasport-code"
    onkeyup="this.value = inputKeyup(this.value)" />
    <span class="error-text" id="error-pasport-code{pass_num}"></span>
</div>

<div class="col-md-3 col-sm-6">
    <label for="pasport-limit-date{pass_num}">${lajax.t('Действителен до')}</label>
    <span class="required">*</span>
    <div class="input-group date"
        id="pasport-limit-datepicker-{pass_num}"
    >
        <input type="text" class="form-control untouched" 
            id="pasport-limit-date{pass_num}"
            data-user-index="{pass_num}"
            data-order-type="pasport-limit-date"
        >
        <span class="input-group-addon">
            <i class="fa fa-calendar"></i>
        </span>
    </div>
    <span class="error-text" id='error-pasport-limit-date{pass_num}'></span>
</div>`;

const passengerInfoHtml = `
<div class="passenger-info">               
    <p class="btn-name accordion collapsed" data-toggle="collapse" 
        href="#{passenger-info}" role="button" data-user-id="{user_id}" onclick="showProductUser({user_id})">
        <a class="link link-light">
            {user name & surname}
        </a>
        <i class="fa fa-angle-right" aria-hidden="true"></i>
    </p>

    <div class="collapse" id="{passenger-info}">
        {navTabHtml}
    </div>
</div>
`
const passengerInfoCollapsedHtml = `
<div class="passenger-info">               
    <p class="btn-name accordion" data-toggle="collapse" aria-expanded="true"
        href="#{passenger-info}" role="button" data-user-id="{user_id}" onclick="showProductUser({user_id})">
        <a class="link link-light">
            {user name & surname}
        </a>
        <i class="fa fa-angle-right" aria-hidden="true"></i>
    </p>

    <div class="collapse in" id="{passenger-info}">
        {navTabHtml}
    </div>
</div>
`

const productBlockHtml = `
    <div class="product-block-item" id="{product_block_id}">
        {navTabHtml}
    </div>
`

const navTabHtml = `
    <ul class="nav nav-tabs"> {navTabItemHtml} </ul>
    <div class="tab-content"> {navTabContentHtml}</div>
`;

// item
const navTabItemHtml = `
    <li class="nav-item {active}">
        <a class="nav-link" data-toggle="tab" data-user-id="{user_id}" data-tab-type="{tab_type}" 
            data-hash="{hash}" data-service="{service}" data-has-content="{has-content}" href="#{tab_id}">{hash}</a>
    </li>
`
// content
const navTabPassContentHtml = `
<div class="tab-pane {active}" id="{tab_id}" data-user-id="{user_id}" data-hash="{hash}" 
    data-tab-type="{tab_type}" role="tabpanel">
    <div data-service-type="nutrition"></div>
    <div data-service-type="baggages"></div>
    <div data-service-type="places"></div>
    <div class="passenger-good-item empty-order">{empty_order}</div>
</div>
`

const navTabGoodContentHtml = `
    <div class="tab-pane {active}" id="{tab_id}" role="tabpanel"  data-user-id="{user_id}" data-hash="{hash}" 
        data-tab-type="{tab_type}">
            <div class="order-body-goods">{good-items}</div>
    </div>
`

// content item
const passItemHtml = `
    <div class="passenger-good-item" data-good-id="{good_id}" data-good-service="{good_service}">
        {good_name}
        <span class="closebtn" onclick="removeGood(this.parentElement)">
            <i class="fa fa-trash-o"></i>
        </span>
    </div>
`;

const goodItemHtml = `
    <div class="good-box">
        <div class="good-img-wraper">
            <a href="{img_url}" class="image-link">
                <img class="img" src="{img_url}" alt="good" >
            </a>
        </div>
        <div class="good-box-title">{good_title}</div>

        <div class="good-box-price">
            <input type="text" value="{price}" name="good-price">
            <div class="good-box-control">
                <input type="button" class="button-count-plus" value="+" 
                data-good-id="{good_id}" data-hash="{hash}" data-max-val="{max_val}" data-service-type="{service_type}" data-user-id="{user_id}">
                <div class="good-count">0</div>
                <input type="button" class="button-count-minus" value="-"
                data-good-id="{good_id}" data-hash="{hash}" data-service-type="{service_type}" data-user-id="{user_id}" />
            </div>
            <button class="btn btn-primary good-box-choose-btn" onclick="showGoodControl(this)">${lajax.t('Выбрать')}</button>
            <i>{data_end}</i>
        </div>
    </div>
`;

const placesItemHtml = `<div class="places-wrap"></div>`;

const modalCloseButtonHtml = `<button type="button" class="btn btn-default" data-dismiss="modal">${lajax.t('Закрыть')}</button>`;
const modalCloseCrossHtml =`<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>`;
const modalOkButtonHtml = `<button type="button" class="btn btn-default" data-dismiss="modal">${lajax.t('Хорошо')}</button>`;
const modalUpdateAdditionalServices = `<button type="button" class="btn btn-default" data-dismiss="modal" onclick="updateAdditionalServices()">${lajax.t('Хорошо')}</button>`;
const modalUpdateAdditionalServicesCross = `<button type="button" class="close" data-dismiss="modal" onclick="updateAdditionalServices()"><span>×</span></button>`;
const modalReloadPageButtonHtml = `<button type="button" class="btn btn-primary" onclick="reloadPage()">${lajax.t('Хорошо')}</button>`;
const modalReloadPageCrossHtml = `<button type="button" class="close" onclick="reloadPage()"><span>×</span></button>`;
const modalRedirectToMainPageButtonHtml = `<button type="button" class="btn btn-primary" onclick="redirectToMainPage()">${lajax.t('Хорошо')}</button>`;
const modalRedirectToMainPageCrossHtml = `<button type="button" class="close" onclick="redirectToMainPage()"><span>×</span></button>`;


/*get total passengers*/

const detailHtml = `<div>{service}: <b>{price} ${lajax.t('грн')}</b></div>`;

let totalPassengers = {
    ADT: getPassengerCount('adults'),
    CHD: getPassengerCount('children'),
    INF: getPassengerCount('childes')
}

for (let passengerType in totalPassengers) {
    let _sessionPassenger;
    let _typeSessionArray = [];


    for (let i = 0; i < totalPassengers[passengerType]; i++) {
        if (sessionStorage.passengers) {
            _sessionPassenger = JSON.parse(sessionStorage.passengers);
            _typeSessionArray = _sessionPassenger.filter(x => x['age-type'] === passengerType);
        }

        if (_typeSessionArray[i]) {
            usersArray.push(
                new User(
                    passengerType,
                    _typeSessionArray[i]['birthday'],
                    _typeSessionArray[i]['citizenship'],
                    _typeSessionArray[i]['name'],
                    _typeSessionArray[i]['pasport-code'],
                    _typeSessionArray[i]['pasport-limit-date'],
                    _typeSessionArray[i]['sex'],
                    _typeSessionArray[i]['surname']
                )
            );
        } else {
            usersArray.push(new User(passengerType));
        }
    }
}

function inputKeyup(val) {
    if (val.charAt(0) === ' ') {
        val = val.substring(1);
    }
    val = val.replace(/ {1,}/g, " ");
    return val.toUpperCase();
}

/******************
 order form
 ******************/
let orderForm = {
    flightID,
    orderId      : null,
    users        : usersArray,
    client_data  : {
        code_phone: '',
        phone     : '',
        email     : ''
    },
    baggages     : null,
    nutrition    : null,
    places       : null,
    paymentMethod: null  // 'LiqPay', 'Fondy', 'Portmone' (unsupported now)
};
function getAdditionalData() {
    additionalData = {
        baggages : {},
        nutrition: {},
        places   : {}
    };

    for (let way of ways) {
        const _hash = $(way).data('hash');
        const _isBaggage = $(way).data('exist-baggage');
        const _isNutrition = $(way).data('exist-nutrition');
        const _isPlaces = $(way).data('exist-places');

        if (!orderForm.baggages) orderForm.baggages = {};
        if (!orderForm.nutrition) orderForm.nutrition = {};
        if (!orderForm.places) orderForm.places = {};

        orderForm.baggages[_hash] = {};
        orderForm.nutrition[_hash] = {};
        orderForm.places[_hash] = {};

        if(_isBaggage || _isNutrition || _isPlaces) {
            getAllAdditionalData.push(getAdditionalDataByHash(_hash));
            isAdditionalData = true;
        }
    }
    Promise.all(getAllAdditionalData).then(
        result => {
            console.log('get additional');
            activateAdditionalButton(true);
        },
        error => console.log('error additional data')
    ).finally(() => {
        console.log('finally');
        getAllAdditionalData = [];
    });
}
getAdditionalData();

$("#additional-services-button").attr("disabled", !orderForm.baggages || !orderForm.nutrition || !orderForm.places);

/**********************
 passenger-block
 **********************/

usersArray.forEach((item, index) => {
    const _userIndex = index + 1;
    let html = passengerFormHTML.replace(/{pass_num}/g, _userIndex);
    html = html.replace(/{todayInput}/g, todayInput);
    html = html.replace(/{tomorrowInput}/g, tomorrowInput);
    html = html.replace(/{yesterdayInput}/g, yesterdayInput);
    html = html.replace(/{maxDataInput}/g, maxDataInput);
    html = html.replace(/{minDataInput}/g, minDataInput);
    html = html.replace(/{optionsCountries}/g, getCountryOptions());

    switch (item['age-type']) {
        case 'ADT':
            html = html.replace(/{pass_type}/g, `(${lajax.t('adult')})`);
            break;
        case 'CHD':
            html = html.replace(/{pass_type}/g, `(${lajax.t('child')})`);
            break;
        case 'INF':
            html = html.replace(/{pass_type}/g, `(${lajax.t('infant')}`);
            break;
    }

    $("#passenger-block").append(`<div class="row fields-block"> ${html} </div>`);

    $('#birthday-datepicker-' + _userIndex).datepicker({
        language: lang,
        format  : 'dd.mm.yyyy',
        autoclose: true
    }).on('hide', ()=>{onFocusOutSafary($('#birthday' + _userIndex))});

    $('#pasport-limit-datepicker-' + _userIndex).datepicker({
        language: lang,
        format  : 'dd.mm.yyyy',
        autoclose: true
    }).on('hide', ()=>{onFocusOutSafary($('#pasport-limit-date' + _userIndex))});

})
$('#passenger-block').find('input[type="text"]').on('blur', onFocusOut);
$('#passenger-block').find('input[type="text"]').on('focus', removeError);
$('#passenger-block').find('input[type="text"]').on('focusout', onFocusOut);
$('#passenger-block').find('input, select').on('change', onFocusOut);

$('#contact-data-block').find('input[type="text"]').change(onFocusOutContact);
$('#contact-data-block').find('input[type="text"]').on('focus', removeError);
$('#contact-data-block').find('input[type="text"]').on('focusout', onFocusOutContact);

$('#rules').click(function () {
    $('#error-rules').html('');
});
$('#rules-egypt').click(function () {
    $('#error-rules-egypt').html('');
});
$('#rules-partner').click(function () {
    $('#error-rules-partner').html('');
});

function getCountryOptions () {
    let _options = '';
    countriesList.forEach(country => {
        _options += `<option value="${country.co}">${country.label}</option>`
    })

    return _options;
}
/**********************
 general methods
 **********************/
window.onpopstate = function(event) {
    if(location.hash == '#additional'){
       moveToAdditionalPage(null);
    } else {
       moveToFirstPage();
    }
}

function getPassengerCount(param) {
    return $('#page-info').data('count-' + param);
}

function onFocusOut() {
    $(this).removeClass('untouched');
    $(this).val($(this).val().trim());
    const field = getField($(this))
    if (field.type == "birthday" || field.type == "pasport-limit-date") {
        orderForm.users[field.index - 1][field.type] = parseDateforRequest(field.value);
    } else {
        orderForm.users[field.index - 1][field.type] = field.value;
    }

    checkUserData(field);
    sendOrderFormFocusOut();
}

function removeError() {
    const field = getField($(this));
    const indexData = field.index ? field.index : '';
    const errorField = $('#error-' + field.type + indexData);
    errorField.html('');
}

function onFocusOutSafary(el) {
    el.removeClass('untouched');
    el.val(el.val().trim());
    const field = getField(el)
    if (field.type == "birthday" || field.type == "pasport-limit-date") {
        orderForm.users[field.index - 1][field.type] = parseDateforRequest(field.value);
    } else {
        orderForm.users[field.index - 1][field.type] = field.value;
    }

    checkUserData(field);
    sendOrderFormFocusOut();
}

function onFocusOutContact() {
    $(this).removeClass('untouched');
    const field = getFieldContact($(this))

    if (field.type === 'phone') {
        const _code = $('#phone-selector-code').html();
        orderForm.client_data[field.type] = field.value;
        orderForm.client_data.code_phone = _code
    } else {
        orderForm.client_data[field.type] = field.value;
    }

    checkUserData(field);
    sendOrderFormFocusOut();
}

function getField(field) {
    return {
        type : field.data('order-type'),
        index: field.data('user-index'),
        value: field.val()
    }
}

function getFieldContact(field) {
    return {
        type : field.data('order-type'),
        value: field.val()
    }
}

$(document).mouseup(function (e) {
    const phoneBlock = $('#country-phone-selector');
    const phoneSearchInput = $('#country-phone-search');
    if (!phoneBlock.is(e.target) && phoneBlock.has(e.target).length === 0
        && !phoneSearchInput.is(e.target)) {
        $('#country-phone-options').hide();
    }
});

// $.fn.datepicker.language[lang] = datepickerDictionary[lang];

/**********************
 form methods
 **********************/
function checkUserData(data) {
    switch (data.type) {
        case 'sex':
            emptyValidation(data);
            break;
        case 'surname':
            onlyLatinLetters(data);
            emptyValidation(data, true);
            break;
        case 'name':
            onlyLatinLetters(data);
            emptyValidation(data, true);
            break;
        case 'birthday':
            onlyBelow100years(data);
            dataFormat(data, true);
            emptyValidation(data, true);
            break;
        case 'citizenship':
            emptyValidation(data);
            break;
        case 'pasport-code':
            onlyLatinLettersAndNumbers(data);
            emptyValidation(data, true);
            break;
        case 'pasport-limit-date':
            onlyOver100years(data);
            emptyValidation(data, true);
            break;
        case 'email':
            onlyEmail(data);
            emptyValidation(data, true);
            break;
        case 'phone':
            onlyPhone(data);
            emptyValidation(data, true);
            break;
    }
}

function sendOrderFormFocusOut() {
    const _errorFields = $('.error-text');
    const _errors = _errorFields.filter(x => {
        return !!_errorFields[x].innerHTML
    });
    if (_errors.length) return;

    sessionStorage.setItem('passengers', JSON.stringify(orderForm.users));
    sessionStorage.setItem('client_info', JSON.stringify(orderForm.client_data));

    const _isContactData = orderForm.client_data.email && orderForm.client_data.phone;
    const _namesArray = orderForm.users.filter(x => x.surname && x.name);
    if (!_isContactData && !_namesArray.length) return;
    console.log('Form', orderForm);
    
    checkAndSendForm();
}

function checkAndSendForm() {
    if(isFormSent) {
        isFormSent = false;
        sendOrderForm();
    } else {
        isSendRepeat = true;
    }
}

function sendOrderForm() {
    $.post(baseUrl + sendFormUrl, orderForm)
        .done(function (data) {
            console.log("success", data);
            if (!orderForm.orderId) {
                orderForm.orderId = data.order_id;
            }
            if(isSendRepeat) {
                isSendRepeat = false;
                sendOrderForm();
            } else if ( isSendPayment ) {
                isFormSent = true;
                sendPaymentForm();
            } else {
                isFormSent = true;

            }
        })
        .fail(function (data) {
                let dataTest = {
                    result     : 'что такое результ?',
                    status_code: data.status,
                    message    : 'Произошла ошибка при бронировании. Мы обновим страницу заказа. Просим повторить бронирование.'
                }
                showErrorStatusModal(dataTest);
            }
        );
}

function showErrorStatusModal(error) {
    $('#modal-pay .load-filters').hide();
    $('#modal-pay .system-loading').hide();
    $('#modal-pay .payment-loading').hide();
    activatePayButtons(true);
    $('#modal-pay').modal('hide');
    if(error.status_code) $('#modal-form-order-error .error-status').text(`${lajax.t('Ошибка')}: ${error.status_code}`);
    $('#modal-form-order-error .error-message').text(error.message);

    switch (error.status_code) {
        case 400:
        case 406:
            $('#modal-error-footer').html(modalReloadPageButtonHtml);
            $('#modal-order-error-close-wrap').html(modalReloadPageCrossHtml);
            break;
        case 403:
        case 404:
        case 407:
        case 500:
            $('#modal-error-footer').html(modalRedirectToMainPageButtonHtml);
            $('#modal-order-error-close-wrap').html(modalRedirectToMainPageCrossHtml);
            break;
        case 410:
            promo_del();
            $('#modal-error-footer').html(modalOkButtonHtml);
            $('#modal-order-error-close-wrap').html(modalCloseCrossHtml);
            break;
        case 408:
            $('#modal-error-footer').html(modalUpdateAdditionalServices);
            $('#modal-order-error-close-wrap').html(modalUpdateAdditionalServicesCross);
            break;
        case 402:
        case 409:
        default:
            $('#modal-error-footer').html(modalOkButtonHtml);
            $('#modal-order-error-close-wrap').html(modalCloseCrossHtml);
    }

    $('#modal-form-order-error').modal('show');
}

function updateClientDataFields() {
    if (sessionStorage.client_info) {
        orderForm.client_data = JSON.parse(sessionStorage.client_info);
        let _codeVal = orderForm.client_data.code_phone || '+380';
        updatePhoneSelected($(`[data-phone="${_codeVal}"]`));
        if (orderForm.client_data.phone) {
            $('#contact-phone').val(orderForm.client_data.phone).removeClass('untouched');
        }
        if (orderForm.client_data.email) {
            $('#mail').val(orderForm.client_data.email).removeClass('untouched');
        }
    }
}

function updatePassengerFields() {
    if (sessionStorage.passengers) {
        orderForm.users.forEach((user, index) => {
            if (user.citizenship) $(`#citizenship${index + 1}`).val(user.citizenship).removeClass('untouched');
            if (user.name) $(`#name${index + 1}`).val(user.name).removeClass('untouched');
            if (user.surname) $(`#surname${index + 1}`).val(user.surname).removeClass('untouched');
            if (user.birthday) $(`#birthday${index + 1}`).removeClass('untouched');
            if (user.sex) $(`#sex${index + 1}`).val(user.sex).removeClass('untouched');
            if (user['pasport-code']) $(`#pasport-code${index + 1}`).val(user['pasport-code']).removeClass('untouched');
            if (user['pasport-limit-date']) $(`#pasport-limit-date${index + 1}`).removeClass('untouched');

            if (user.birthday) $(`#birthday-datepicker-${index + 1}`).datepicker("setDate", new Date(user.birthday) );
            if (user['pasport-limit-date']) $(`#pasport-limit-datepicker-${index + 1}`).datepicker("setDate", new Date(user['pasport-limit-date'])) ;
        });
    }
}

function updateAdditionalServices() {
    serviceTypes.forEach( service => {
        for(let item in orderForm[service]) {
            orderForm[service][item] = {};
        }
    })

    activateAdditionalButton(false);

    checkAndSendForm();
    removeSecondStep();

    totalSumm();
    getAdditionalData();

    setTimeout(() => {
        addHistory('additional');
        moveToAdditionalPage(null);
    }, 3000)

}

function removeSecondStep() {
    movedToSecondStep = false;
    $("#all-passengers-info").text('');
    for (let _service of serviceTypes) {
        $(`#all-${_service}-tabs`).text('');
    }

}

/**********************
 buttons methods
 **********************/
$('.button-buy').click(function () {
    if (isUserFormValid() && isRulesAgreed()) {
        if(!orderForm.order_id){
            sendOrderFormFocusOut(); // дублирование?
        }
        orderForm.paymentMethod = $(this).data('method');
        console.log('Form', orderForm);
        if (orderForm.paymentMethod === 'Portmone') {
            alert('Portmone unsupported now');
            return;
        }

        $('#modal-pay .load-filters').show();
        $('#modal-pay .system-loading').show();
        $('#modal-pay').modal({backdrop: 'static', keyboard: true});
        activatePayButtons(false);
        if(!orderForm.orderId) {
            checkAndSendForm();  // дублирование?
        }

        if(isFormSent) {
            sendPaymentForm();
        } else {
            isSendPayment = true;
        }
    } else {
        const error = {message: `${lajax.t('К сожалению, форма заполнена неправильно, пожалуйста, исправьте ошибки перед отправкой')}`}
        showErrorStatusModal(error);
    }
});

function sendPaymentForm() {
    $.post(baseUrl + paymentUrl, orderForm)
        .done(function (data) {
            if(data.result == 'error') {
                showErrorStatusModal(data);
            }else{
                console.log("success", data);
                $('#buy-buttons').addClass('disabled-buttons');
                $('#modalPayLabel .full_order_price').text($('#total-summ').text());
                if (data.sign) {
                    liqPayInit(data);
                }
                if (data.MerchantId) {
                    fondyInit(data);
                }
            }
            isSendPayment = false;
            activatePayButtons(true);
        })
        .fail(function (data) {
                let dataTest = {
                    result     : 'что такое результ?',
                    status_code: data.status,
                    message    : 'Произошла ошибка при бронировании. Мы обновим страницу заказа. Просим повторить бронирование.'
                }
                showErrorStatusModal(dataTest);
                isSendPayment = false;
                activatePayButtons(true);
            }
        );
}

function activatePayButtons(state) {
    if(state) {
        $('#buy-buttons').removeClass('disabled-buttons');
    }else{
        $('#buy-buttons').addClass('disabled-buttons');
    }
}

function activateAdditionalButton(state) {
    if(state) {
        $('#additional-services-button').removeClass('disabled');
    } else {
        $('#additional-services-button').addClass('disabled');
    }
}

// method for open additional page
$('#additional-services-button').click(() => {
    addHistory('additional');
    moveToAdditionalPage(null);
});

$('#return-to-passengers, #all-passengers-info-error-form').click(function () {
    addHistory();
    moveToFirstPage();
})

$('#nutrition-show-all-button').click(function () {
    $(this).hide();
    $('#nutrition-hide-all-button').show();
    $('#nutrition-collapse').collapse('show');
});

$('#baggages-show-all-button').click(function () {
    $(this).hide();
    $('#baggages-hide-all-button').show();
    $('#baggages-collapse').collapse('show');
});

$('#places-show-all-button').click(function () {
    $(this).hide();
    $('#places-hide-all-button').show();
    $('#places-collapse').collapse('show');
});

$('#nutrition-hide-all-button').click(function () {
    $(this).hide();
    $('#nutrition-show-all-button').show();
    $('#nutrition-collapse').collapse('hide');
});

$('#baggages-hide-all-button').click(function () {
    $(this).hide();
    $('#baggages-show-all-button').show();
    $('#baggages-collapse').collapse('hide');
});

$('#places-hide-all-button').click(function () {
    $(this).hide();
    $('#places-show-all-button').show();
    $('#places-collapse').collapse('hide');
});

$('#modal-pay .close').click(closePaymentModal);

$('#promo').click(send_promo);
$('#promo-del').click(promo_del);

/**********************
 validation methods
 **********************/
function emptyValidation(data, oneBefore) {
    const indexData = data.index ? data.index : '';
    const errorField = $('#error-' + data.type + indexData);
    if (!data.value) {
        errorField.html(lajax.t('Поле обязательное для заполнения'));
    } else if (!oneBefore) {
        errorField.html('');
    }
}

function onlyLatinLetters(data, oneBefore) {
    const indexData = data.index ? data.index : '';
    const errorField = $('#error-' + data.type + indexData);
    const reg = /^[A-Z+(\s)]+$/g;
    const result = reg.test(data.value)

    if (!result) {
        errorField.html(lajax.t('Поле должно содержать Латинские символы'));
    } else if (!oneBefore) {
        errorField.html('');
    }
}

function onlyLatinLettersAndNumbers(data, oneBefore) {
    const indexData = data.index ? data.index : '';
    const errorField = $('#error-' + data.type + indexData);
    const reg = /^[A-Z0-9+(\s)]+$/g;
    const result = reg.test(data.value)

    if (!result) {
        errorField.html(lajax.t('Поле должно содержать Латинские символы или цифры'));
    } else if (!oneBefore) {
        errorField.html('');
    }
}

function onlyEmail(data, oneBefore) {
    const indexData = data.index ? data.index : '';
    const errorField = $('#error-' + data.type + indexData);
    const reg = /^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9_\-]+\.)*[a-z0-9_\.)+[a-z]{2,6}$/i;
    const result = reg.test(data.value)

    if (!result) {
        errorField.html(lajax.t('Введите корректный email'))
    } else if (!oneBefore) {
        errorField.html('');
    }
}

function onlyPhone(data, oneBefore) {
    let isUkraineValid = true;
    const indexData = data.index ? data.index : '';
    const errorField = $('#error-' + data.type + indexData);
    const reg = /^[0-9.]{9,15}$/g;

    if($('#phone-selector-code').text() === '+380') {
        isUkraineValid = data.value.charAt(0) !== '0';
    }
    const result = reg.test(data.value) && isUkraineValid;

    if (!result) {
        errorField.html(lajax.t('Введите корректный телефон'))
    } else if (!oneBefore) {
        errorField.html('');
    }
}

function dataFormat(data, oneBefore) {
    const indexData = data.index ? data.index : '';
    const errorField = $('#error-' + data.type + indexData);

    const result = checkDateFormat(data.value);

    if (!result) {
        errorField.html(lajax.t('Введите корректный формат даты'))
    } else if (!oneBefore) {
        errorField.html('');
    }
}

function onlyBelow100years(data, oneBefore) {
    const indexData = data.index ? data.index : '';
    const errorField = $('#error-' + data.type + indexData);

    const result = checkDateFormat(data.value);
    if (!result) return;

    const dateDifference = Date.now() - Date.parse(formatDate(data.value));
    if (dateDifference < 0) {
        errorField.html(lajax.t('Дата не должна быть будущей'));
    } else if (hundredYears < dateDifference) {
        errorField.html(lajax.t('Дата не должна быть так давно'));
    } else {
        errorField.html('')
    }
}

function onlyOver100years(data, oneBefore) {
    const indexData = data.index ? data.index : '';
    const errorField = $('#error-' + data.type + indexData);

    const result = checkDateFormat(data.value);
    if (!result) return;

    const dateDifference = Date.parse(formatDate(data.value)) - Date.now();

    if (dateDifference + oneDay < 0) {
        errorField.html(lajax.t('Паспорт просрочен!'));
    } else if (hundredYears < dateDifference) {
        errorField.html(lajax.t('Срок не может быть больше 100 лет'));
    } else {
        errorField.html('');
    }
}

function isUserFormValid() {
    formValid = true;

    // check Form data
    const untouchedFormFields = $('#passenger-block').find('input.untouched, select.untouched');
    // check Contact Data
    const untouchedСontactFields = $('#contact-data-block').find('input.untouched, select.untouched');
    
    
    for (let item of untouchedFormFields) {
        checkUserData(getField($(item)));
    }
    for (let item of untouchedСontactFields) {
        checkUserData(getFieldContact($(item)));
    }

    const errorFields = $('#passenger-block, #contact-data-block').find('span[id *="error"]');

    for (let item of errorFields) {
        if (item.innerHTML !== '') {
            formValid = false;
            console.log(lajax.t('Стоп'));
            break;
        } else {
            console.log(1);
        }
    }
    return formValid;
}

function isRulesAgreed() {
    // check Rules
    checkRules('rules');
    checkRules('rules-egypt');
    checkRules('rules-partner');

    return formValid;
}

function checkRules(rules) {
    const _el = $('#' + rules);
    if (_el.length) {
        const _isChecked = _el.is(':checked');
        if (!_isChecked) {
            formValid = false;
            $('#error-' + rules).html(lajax.t('Нужно согласиться с правилами'));
        }
    }
}

function checkDateFormat(date) {
    const reg = /^\d\d.\d\d.\d\d\d\d$/g;
    let result = reg.test(date)

    if (result) {
        const dateArray = date.split('.');
        if (dateArray[0] > 32) {
            result = false;
        } else if (dateArray[1] > 12) {
            result = false;
        } else if (dateArray[2] < 1500) {
            result = false;
        }
    }

    return result
}

function formatDate(date) {
    const mm = date.slice(3, 5);
    const dd = date.slice(0, 2);
    const yyyy = date.slice(6, 10);
    return `${yyyy}-${mm}-${dd}`;
}

/**********************
 plugins
 **********************/

// $('#expirationTimer').timezz({
//   'date' : dataResultExpired,
//   'days': lajax.t('days'),
//   'hours': lajax.t('hours'),
//   'minutes': lajax.t('minutes'),
//   'seconds': lajax.t('seconds')
// });

/**********************
 country-phone-selector
 **********************/
$('#country-phone-selector').click(function () {
    $('#country-phone-options').toggle();
});

function createPhoneList(search) {
    let _html = '';
    let _phoneArray = [];

    if (search) {
        _phoneArray = countriesList.filter(
            item => item.label.toUpperCase().includes(search.toUpperCase())
        );
    } else {
        _phoneArray = countriesList;
    }

    for (let phone of _phoneArray) {
        let _htmlItem = phoneListHtml.replace(/{data_phone}/g, phone.data);
        _htmlItem = _htmlItem.replace(/{co_phone}/g, phone.co);
        _htmlItem = _htmlItem.replace(/{phone_label}/g, phone.label);
        _html += _htmlItem;
    }
    $('#phone-list').html(_html);
}

createPhoneList();

function updatePhoneSelected(field) {
    const _phoneCode = $(field).data('phone');
    const _phoneCo = $(field).data('co');
    const _html = `<img class="flag flag-${_phoneCo}" /> <span id="phone-selector-code">${_phoneCode}</span>`;
    orderForm.client_data.code_phone = _phoneCode;
    $('#country-phone-selector').html(_html);
}

/**********************
 total summ
 **********************/
function totalSumm() {
    userOrdersSumm = {baggages: {}, nutrition: {}, places: {}};

    // _userOrders переобразование заказов пользователя в нужный мне формат
    // [
    //    {userId, service, order: {1: 4, 2:1}, hash}
    //    ...
    //]
    let _userOrders = [];
    let totalBaggagesPrice = 0;
    let totalNutritionPrice = 0;
    let totalPlacesPrice = 0;

    const totalTicketsPrice = +$('#total-summ').data('price_digits');

    $('#total-sum-details').html('');
    if (totalTicketsPrice > 0) $('#total-sum-details').append(`<div>${lajax.t('Стоимость билетов')}: <b>${totalTicketsPrice} ${lajax.t('грн')}.</b></div>`);

    // create orders for one hash
    for (let _service of serviceTypes) {
        if (orderForm[_service]) {
            for (let _hash in orderForm[_service]) {
                for (let _user in orderForm[_service][_hash]) {
                    _userOrders.push({
                        _user, _service, order: orderForm[_service][_hash][_user], _hash
                    })
                }
            }
        }
    }

    for (let _service of serviceTypes) {
        usersArray.forEach((item, index) => {
            let summ = 0;
            const _userId = index + 1;
            // фильтрует по сервису и по пользователю
            const _userOrderArrayService = _userOrders.filter(item => item._user == _userId && item['_service'] == _service);

            for (let _item of _userOrderArrayService) {
                if (_service !== 'places') {
                    for (let _order in _item.order) {
                        let _additionalService = additionalData[_service][_item._hash].filter(item => item.id == _order)[0];
                        summ += _additionalService.price * _item.order[_order];
                        userOrdersSumm[_service][_userId] = summ;
                    }
                } else {
                    const places = additionalData[_service][_item._hash];
                    for (let key in places) {
                        if (key == _item.order.row) {
                            for (let _place in places[key]) {
                                if (_place === _item.order.place) {
                                    summ += places[key][_place]['price'];
                                }
                            }
                        }
                    }
                    userOrdersSumm[_service][_userId] = summ;
                }
            }
        });
    }
    // на выходе получаем
    // userOrdersSumm.nutrition = {2: 1, 3: 2, 1: 3};
    // userOrdersSumm.baggages = {1: 1, 3: 10};
    // userOrdersSumm.places = {1: 650, 2: 30}

    // userOrdersSumm.places = {1: 650, 2: 350}

    for (let _service of serviceTypes) {

        let _serviceName = '';
        if (_service === 'nutrition') _serviceName = lajax.t('Стоимость дополнительно питания');
        if (_service === 'baggages') _serviceName = lajax.t('Стоимость дополнительного багажа');
        if (_service === 'places') _serviceName = lajax.t('Стоимость услуги выбора места');


        let _html = detailHtml.replace('{service}', _serviceName);

        for (let _user in userOrdersSumm[_service]) {
            let _price = userOrdersSumm[_service][_user]
            if (_service === 'nutrition') {
                totalNutritionPrice += _price
            }
            ;
            if (_service === 'baggages') {
                totalBaggagesPrice += _price
            }
            ;
            if (_service === 'places') {
                totalPlacesPrice += _price
            }
            ;
        }

        if (_service === 'nutrition') _html = _html.replace('{price}', totalNutritionPrice);
        if (_service === 'baggages') _html = _html.replace('{price}', totalBaggagesPrice);
        if (_service === 'places') _html = _html.replace('{price}', totalPlacesPrice);

        if (_service === 'nutrition' && !totalNutritionPrice) _html = '';
        if (_service === 'baggages' && !totalBaggagesPrice) _html = '';
        if (_service === 'places' && !totalPlacesPrice) _html = '';

        $('#total-sum-details').append(_html);
    }

    addDiscount();

    const totalSummVal = totalTicketsPrice + totalBaggagesPrice + totalNutritionPrice + totalPlacesPrice - tiketDiscount;

    $('#total-summ').html(`${totalSummVal} ${lajax.t('грн')}`);
}

totalSumm();

function numberFormat(number, decimals, dec_point, thousands_sep) {
    var i, j, kw, kd, km;

    if (isNaN(decimals = Math.abs(decimals))) {
        decimals = 2;
    }
    if (dec_point == undefined) {
        dec_point = ",";
    }
    if (thousands_sep == undefined) {
        thousands_sep = " ";
    }

    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

    if ((j = i.length) > 3) {
        j = j % 3;
    } else {
        j = 0;
    }

    km = (j ? i.substr(0, j) + thousands_sep : "");
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
    kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");

    return km + kw + kd;
}

/**************************
 passenger info block
 **************************/
function createPassengerInfoBlocks() {
    usersArray.forEach(function (item, index) {
        let html = index ? passengerInfoHtml : passengerInfoCollapsedHtml;

        html = html.replace(/{passenger-info}/g, 'passenger-info' + (index + 1));
        html = html.replace(/{user_id}/g, (index + 1));
        html = html.replace(/{user name & surname}/g, `${item.name} ${item.surname}`);
        html = html.replace(/{navTabHtml}/g, createPassengerTabBlock(ways, (index + 1)));

        $("#all-passengers-info").append(html);
    })

    const _allAcordionEls = $('#all-passengers-info').find('[data-toggle="collapse"]');
    _allAcordionEls.click(function () {
        const _userId = $(this).data('user-id');
        _allAcordionEls.each(function (index, item) {
            if ($(item).data('user-id') == _userId) {
                $(item).next().collapse('toggle');
            } else {
                $(item).next().collapse('hide');
            }
        })
    });
}

function updatePassengerInfoBlocks() {
    usersArray.forEach(function (item, index) {
        $('#all-passengers-info').find(`[data-user-id="${index + 1}"] .link`).text(`${item.name} ${item.surname}`);
    });
}

function removeGood(goodItem) {
    const _parentEl = $(goodItem).parent();
    const _service = $(goodItem).data('good-service');
    const _goodId = $(goodItem).data('good-id');
    const _hash = _parentEl.parent().data('hash');
    const _userId = _parentEl.parent().data('user-id');

    $(goodItem).remove();

    if (_service !== 'places') {
        delete orderForm[_service][_hash][_userId][_goodId];
        const _itemGoodControll = $(`#all-${_service}-tabs`).find(`[class="button-count-plus"][data-user-id="${_userId}"][data-hash="${_hash}"][data-good-id="${_goodId}"]`);
        const _controllWraper = _itemGoodControll.parent();
        
        _itemGoodControll.next().html(0);
       _controllWraper.hide();
       _controllWraper.parent().children( ".good-box-choose-btn").show();
        
    } else {
        let _planePlaces = $(`#all-${_service}-tabs`).find(`.tab-pane[data-user-id="${_userId}"][data-hash="${_hash}"]`);
        _planePlaces.find('.place-selected').removeClass('place-selected').addClass('place');

        const _removingPlace = orderForm[_service][_hash][_userId];
        _planePlaces = $(`#all-${_service}-tabs`).find(`.place-disabled-user[data-position-row="${_removingPlace.row}"][data-position-place="${_removingPlace.place}"][data-hash="${_hash}"]`);
        _planePlaces.removeClass('place-disabled-user').addClass('place');

        orderForm[_service][_hash][_userId] = {};
    }

    chackeUserInfoGoodsIsEmpty();
}

/**********************
 additional page
 **********************/
function moveToAdditionalPage(service, hash) {
    isUserFormValid();
    setTimeout(() => {
        $(this).hide();
        $('#link_for_search').hide();
        $('#return-to-passengers').show();

        $('#order-first-step').hide();
        $('#order-second-step').fadeIn('slow');

        if (!movedToSecondStep) {
            createPassengerInfoBlocks();
            createProductBlocks();
            addIterationMethod(); // for good iteration
            showProductTab();
            hideExtraBlocks(1);
            checkHasContent();

            movedToSecondStep = true;
        }

        blockAdditionalPage();

        showProductBlocks(service, hash);
        $(window).scrollTop(0);
    }, 10)
}

function moveToFirstPage() {
    $("#return-to-passengers").hide();
    $('#link_for_search').show();
    $('#additional-services-button').show();

    $('#order-first-step').fadeIn('slow');
    $('#order-second-step').hide();
}

/**************************
 product block
 **************************/
function createProductBlocks() {
    for (let _service of serviceTypes) {
        let html, htmlAll = '';
        let _indexArray = [];

        if (orderForm[_service]) {
            usersArray.forEach(function (item, index) {
                const _productIndexBlock = `${_service}-block-item${index + 1}`;
                // создается html с нужными табами
                html = productBlockHtml.replace('{navTabHtml}', createProductTabBlock(orderForm[_service], (index + 1), _service));
                html = html.replace('{product_block_id}', _productIndexBlock);

                htmlAll += html;

                _indexArray.push(_productIndexBlock)
            })
        }

        $(`#all-${_service}-tabs`).append(htmlAll);

        _indexArray.forEach((item) => {
            $('#' + item + ' .image-link').viewbox();
        })
    }
}

function addIterationMethod() {
    const controllBoxes = $('#all-nutrition-tabs, #all-baggages-tabs').find('.good-box-control');

    controllBoxes.find('.button-count-minus').on('click', function () {
        const _service = $(this).data('service-type');
        const _hash = $(this).data('hash');
        const _userId = $(this).data('user-id');
        const _goodId = $(this).data('good-id');
        const _countEl = $(this).prev();

        let _countElValue = _countEl.html();
        let _newVal = (_countElValue === '0') ? 0 : _countElValue - 1;

        $(this).parent().children('.button-count-plus').css('visibility', 'inherit');

        _countEl.html(_newVal);

        if(!_newVal) {
            controllBoxes.hide();
            controllBoxes.parent().children( ".good-box-choose-btn").show();
        }


        if (!orderForm[_service][_hash][_userId]) orderForm[_service][_hash][_userId] = {};
        orderForm[_service][_hash][_userId][_goodId] = _newVal;

        chackeUserInfoGoods();
    })
    controllBoxes.find('.button-count-plus').on('click', function () {
        const _service = $(this).data('service-type');
        const _hash = $(this).data('hash');
        const _userId = $(this).data('user-id');
        const _goodId = $(this).data('good-id');
        const _maxVal = $(this).data('max-val') ? $(this).data('max-val') : 100;
        const _countEl = $(this).next();

        let _countElValue = _countEl.html();
        let _newVal = (_countElValue == _maxVal) ? _maxVal : +_countElValue + 1;

        if (_maxVal == _newVal) $(this).css('visibility', 'hidden');
        _countEl.html(_newVal);

        if (!orderForm[_service][_hash][_userId]) orderForm[_service][_hash][_userId] = {};
        orderForm[_service][_hash][_userId][_goodId] = _newVal;

        chackeUserInfoGoods();
    })
}

function onPlaceSelected(selectStatus, placeData, userId, hash) {
    const _service = 'places';
    if (selectStatus) {
        orderForm[_service][hash][userId] = placeData; // exmp. placeData = {row: 1, place: 'B'};

        const _planePlaces = $(`#all-${_service}-tabs`).find(`[data-position-row="${placeData.row}"][data-position-place="${placeData.place}"][data-hash="${hash}"]`);

        _planePlaces.each(function (index, item) {
            if ($(item).data('user-id') != userId) {
                $(item).removeClass('place').addClass('place-disabled-user');
            }
        })
    } else {
        orderForm[_service][hash][userId] = {};
        const _planePlaces = $(`#all-${_service}-tabs`).find(`.place-disabled-user[data-position-row="${placeData.row}"][data-position-place="${placeData.place}"][data-hash="${hash}"]`);
        _planePlaces.removeClass('place-disabled-user').addClass('place');
    }

    chackeUserInfoGoods();
}

function hideExtraBlocks(userId) {
    for (let _service of serviceTypes) {
        usersArray.forEach((item, index) => {
            if (userId == index + 1) {
                $(`#${_service}-block-item` + (index + 1)).show();
            } else {
                $(`#${_service}-block-item` + (index + 1)).hide();
            }
        });
    }
}

function showProductBlocks(service, hash) {
    $('#additional-services-button').hide();
    $('#nutrition-collapse').removeClass('active');
    $('#nutrition-collapse, #baggages-collapse, #places-collapse').removeClass('collapsed').removeClass('in').addClass('collapse');

    if (service === 'nutrition') {
        $(`.nav-link[data-toggle="tab"][data-hash="${hash}"]`).click();
        $('#nutrition-show-all-button').click();
        return;
    }

    if (service === null) {
        $('#nutrition-collapse').addClass('active');
        return;
    }

    const _scrollTo = $(`#${service}-collapse`).offset().top - 130;
    
    $(`.nav-link[data-toggle="tab"][data-hash="${hash}"]`).click();
    setTimeout(function () {
        $('html, body').animate({scrollTop: _scrollTo}, 2000, function () {
            $(`#${service}-show-all-button`).click();
        });

    }, 500);
};

function showProductTab() {
    $('.nav-link[data-toggle="tab"]').click(function () {
        const _hasContent = $(this).data('has-content');
        const _service = $(this).data('service');
        const _tabType = $(this).data('tab-type');
        const _userId = $(this).data('user-id');
        const _hash = $(this).data('hash');
        const _newTabType = _tabType == 'pass-info' ? 'product' : 'pass-info';
        const _newTabTypesArray = ['product'];
        if (_newTabType !== 'product') _newTabTypesArray.push(_newTabType);

        for (let _type of _newTabTypesArray) {
            $(`.nav-link[data-toggle="tab"][data-tab-type="${_type}"][data-user-id="${_userId}"]`).parent().removeClass('active');
            $(`.nav-link[data-toggle="tab"][data-tab-type="${_type}"][data-user-id="${_userId}"][data-hash="${_hash}"]`).parent().addClass('active');

            $(`.tab-pane[data-tab-type="${_type}"][data-user-id="${_userId}"]`).removeClass('active');
            $(`.tab-pane[data-tab-type="${_type}"][data-user-id="${_userId}"][data-hash="${_hash}"]`).addClass('active');
        }
        checkHasContent();
    });
    
}

function showProductUser(userIdx){
    usersArray.forEach((item, index)=>{
        if(index + 1 == userIdx) {
            $('#nutrition-block-item' + userIdx).show();
            $('#baggages-block-item' + userIdx).show();
            $('#places-block-item' + userIdx).show();
        } else {
            $('#nutrition-block-item' + (index + 1)).hide();
            $('#baggages-block-item' + (index + 1)).hide();
            $('#places-block-item' + (index + 1)).hide();
        }
    })
}

function tabHeight(hasContent, service) {
    if(hasContent == 'empty') {
        $(`#${service}-collapse`).addClass('empty');
    } else {
        $(`#${service}-collapse`).removeClass('empty');
    }
}

function checkHasContent() {
    serviceTypes.forEach( (service) => {
        const _hasContent = $(`#${service}-collapse .nav-item.active>a`).data('has-content');
        tabHeight(_hasContent, service);
    });
}

/**********************
 create html
 **********************/
// create tab passenger block
function createPassengerTabBlock(array, userId) {
    let _navTabItems = '';
    let _navTabContents = '';
    let wayIndex = 0;
    const _tabName = `passenger-info${userId}`;
    const _tabType = 'pass-info';

    for (let tab of array) {
        let _navItem;
        let _navContent;
        const _tabId = `${_tabName}-tab${wayIndex + 1}`;
        const _hash = $(tab).data('hash');
        if (!wayIndex) {
            _navItem = navTabItemHtml.replace(/{active}/g, 'active');
            _navContent = navTabPassContentHtml.replace(/{active}/g, 'active');
        } else {
            _navItem = navTabItemHtml.replace(/{active}/g, '');
            _navContent = navTabPassContentHtml.replace(/{active}/g, '');
        }
        _navItem = _navItem.replace(/{user_id}/g, userId);
        _navItem = _navItem.replace(/{tab_type}/g, _tabType);
        _navItem = _navItem.replace(/{hash}/g, _hash);
        _navItem = _navItem.replace(/{tab_id}/g, _tabId);

        _navContent = _navContent.replace('{empty_order}', lajax.t('Вы пока ни чего не выбрали'));
        _navContent = _navContent.replace(/{tab_id}/g, _tabId);
        _navContent = _navContent.replace('{user_id}', userId);
        _navContent = _navContent.replace('{hash}', _hash);
        _navContent = _navContent.replace(/{tab_type}/g, _tabType);

        _navTabItems += _navItem;
        _navTabContents += _navContent;

        wayIndex++;
    }

    let _navTab = navTabHtml.replace(/{navTabItemHtml}/g, _navTabItems);
    _navTab = _navTab.replace(/{navTabContentHtml}/g, _navTabContents);

    return _navTab;
}

function createProductTabBlock(hashArray, userId, service) {
    let _navTabItems = '';
    let _navTabContents = '';
    let wayIndex = 0;
    const _tabType = 'product';

    for (let _hash in hashArray) { // формирует табы
        let _navItem;
        let _navContent;
        const _tabId = `${service}${userId}-tab${wayIndex + 1}`;
        if (!wayIndex) {
            _navItem = navTabItemHtml.replace('{active}', 'active');
            _navContent = navTabGoodContentHtml.replace(/{active}/g, 'active');
        } else {
            _navItem = navTabItemHtml.replace('{active}', '');
            _navContent = navTabGoodContentHtml.replace(/{active}/g, '');
        }
        if(additionalData[service][_hash]) {
            _navItem = _navItem.replace('{has-content}', 'full');
        } else {
            _navItem = _navItem.replace('{has-content}', 'empty');
        }

        _navItem = _navItem.replace(/{hash}/g, _hash);
        _navItem = _navItem.replace(/{user_id}/g, userId);
        _navItem = _navItem.replace(/{tab_type}/g, _tabType);
        _navItem = _navItem.replace(/{service}/g, service);
        _navItem = _navItem.replace(/{tab_id}/g, _tabId);

        _navContent = _navContent.replace(/{tab_id}/g, _tabId);
        _navContent = _navContent.replace(/{user_id}/g, userId);
        _navContent = _navContent.replace(/{hash}/g, _hash);
        _navContent = _navContent.replace(/{tab_type}/g, _tabType);

        if (service !== 'places') {
            _navContent = _navContent.replace('{good-items}', getGoodItemsHtml(additionalData[service][_hash], _hash, service, userId));
        } else {
            _navContent = _navContent.replace('{good-items}', getPlacesItemsHtml(additionalData[service][_hash], _tabId, _hash, service, userId));
        }

        _navTabItems += _navItem;
        _navTabContents += _navContent;

        wayIndex++;
    }

    let _navTab = navTabHtml.replace(/{navTabItemHtml}/g, _navTabItems);
    _navTab = _navTab.replace(/{navTabContentHtml}/g, _navTabContents);

    return _navTab;
}

function getGoodItemsHtml(goodObj, hash, service, userId) {
    let _goodItems = '';
    for (let item in goodObj) {
        const imgUrl = goodObj[item]['image_url'] ? goodObj[item]['image_url'] : 'https://bravry.com.ua/images/img-404.png';
        const _dataEnd = new Date(goodObj[item]['expired_at'] * 1000);
        const _maxCount = goodObj[item]['max_count'] ? goodObj[item]['max_count'] : 0;

        let _goodItem = goodItemHtml.replace(/{img_url}/g, imgUrl);
        _goodItem = _goodItem.replace(/{good_title}/g, goodObj[item][lang]);
        _goodItem = _goodItem.replace(/{price}/g, `${goodObj[item]['price']} ${lajax.t('uah')}`);
        _goodItem = _goodItem.replace(/{good_id}/g, goodObj[item]['id'])
        _goodItem = _goodItem.replace(/{data_end}/g, `${lajax.t('Можно заказать до')} <span class="no-wrap">${parseDate(_dataEnd)}</span>`);
        _goodItem = _goodItem.replace(/{hash}/g, hash);
        _goodItem = _goodItem.replace(/{max_val}/g, _maxCount);
        _goodItem = _goodItem.replace(/{service_type}/g, service);
        _goodItem = _goodItem.replace(/{user_id}/g, userId);
        _goodItems += _goodItem;
    }

    if (!_goodItems) {
        if (service == 'nutrition') return lajax.t('К сожалению, питание в данном рейсе недоступно');
        if (service == 'baggages') return lajax.t('К сожалению, услуги багажа в данном рейсе не доступно');
    }
    return _goodItems;
}

function getPlacesItemsHtml(goodObj, tabId, hash, service, userId) {

    let _html = placesItemHtml;

    if(!goodObj) return _html;

    setTimeout(() => {
        $(`#${tabId} .order-body-goods`).createPlane(
            goodObj,
            {
                hash,
                userId,
                errorText: lajax.t('Возможность выбрать места недоступна'),
                canChoose: 'can-choose'
            }
        );
    }, 100);

    return _html;
}

function chackeUserInfoGoods() {
    for (let _service of serviceTypes) {
        for (let _hash in orderForm[_service]) { // get hash
            for (let _userId in orderForm[_service][_hash]) { // get userId
                let _html = '';
                const _tabEl = $('#all-passengers-info').find(`.tab-content [data-user-id="${_userId}"][data-hash="${_hash}"]`);
                const _tabElChild = _tabEl.children(`[data-service-type="${_service}"]`);

                if (_service !== 'places') {
                    for (let _item in orderForm[_service][_hash][_userId]) { // get products item
                        const _goodTotal = orderForm[_service][_hash][_userId][_item];
                        if (!_goodTotal) {
                            delete orderForm[_service][_hash][_userId][_item]; // if item == 0 remove this item
                        } else {
                            const _goodData = additionalData[_service][_hash].filter(item => item.id == _item)[0];
                            const _countText = (_goodTotal > 1) ?
                                `(${_goodData['price']}${lajax.t('грн')} x${_goodTotal})` :
                                `(${_goodData['price']}${lajax.t('грн')})`;

                            let _htmlItem = passItemHtml.replace('{good_name}', `<span>${_goodData[lang]} <font class="no-wrap">${_countText}</font></span>`);
                            _htmlItem = _htmlItem.replace('{good_id}', _item);
                            _htmlItem = _htmlItem.replace('{good_service}', _service);
                            _html += _htmlItem;
                        }
                    }
                } else {
                    const _placeInfo = orderForm[_service][_hash][_userId];
                    if (_placeInfo.row) {
                        const _row = _placeInfo.row;
                        const _place = _placeInfo.place;
                        const _placeData = additionalData[_service][_hash][_row][_place];
                        const _priceText = `(${_placeData['price']}${lajax.t('грн')})`;
                        let _htmlItem = passItemHtml.replace('{good_name}', `<span>${lajax.t('место в самолете')} <b>${_row}${_place}</b> <font class="no-wrap">${_priceText}</font></span>`);
                        _htmlItem = _htmlItem.replace('{good_id}', '-');
                        _htmlItem = _htmlItem.replace('{good_service}', _service);
                        _html += _htmlItem;
                    }
                }
                _tabElChild.html(_html);
            }
        }
    }
    chackeUserInfoGoodsIsEmpty();
}

function chackeUserInfoGoodsIsEmpty() {
    const allTabContents = $('#all-passengers-info').find('.tab-pane');
    allTabContents.each((index, item) => {
        const _isNutritionHtml = $(item).children(`[data-service-type="nutrition"]`).find('.passenger-good-item');
        const _isBaggagesHtml = $(item).children(`[data-service-type="baggages"]`).find('.passenger-good-item');
        const _isPlacesHtml = $(item).children(`[data-service-type="places"]`).find('.passenger-good-item');
        const _emptyOrderField = $(item).children('.empty-order');
        if (_isBaggagesHtml.length || _isNutritionHtml.length || _isPlacesHtml.length) {
            _emptyOrderField.hide();
        } else {
            _emptyOrderField.show();
        }
        ;
    })
    totalSumm();
}

/**********************
 other methods
 **********************/
if(welcome){
    $('#modal-wellcome').modal('show');
}

function addDiscount() {
    if (tiketDiscount) {
        let _html = detailHtml.replace('{service}', lajax.t('cкидка'));
        _html = _html.replace('{price}', tiketDiscount);
        $('#total-sum-details').append(_html);
    }
}

function addHistory(page) {
    page ? 
    history.pushState('additioal', null, '?' + page):
    history.pushState('additioal', null, '');
}

function reloadPage() {
    location.reload();
}

function redirectToMainPage() {
    location.replace(searchLink);
}

// format data
function stringifyInputDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getAdditionalDataByHash(hash) {
    const url = `${baseUrl}/web-data/additional-services-online`;
    
    return new Promise((resolve, reject)=>{
        $.post( url, {flyPropertyId: flightID, route: hash, serviceName: 'places,baggages,nutrition'}, function( data ) {
            serviceTypes.forEach((service) => {
                const serviceData = data[service];
                additionalData[service][hash] = serviceData;
                showMinCost(service, hash, serviceData);
            });
            resolve('done');
        });
    });
}

function showMinCost(service, hash, serviceData) {
    const _textMinPriceEl = $(`.additional-min-price[data-hash="${hash}"][data-service="${service}"]`);
    if (serviceData && serviceData.length && service !== 'places') {
        const _priceArray = serviceData.map(x => x.price);
        const _minPrice = Math.min.apply(null, _priceArray);
        _textMinPriceEl.text(`${lajax.t('от')}: ${_minPrice} ${lajax.t('грн')}`);
    } else if (serviceData && serviceData[1] && service == 'places') {
        const _priceArray = [];
        for (row in serviceData) {
            for (place in serviceData[row]) {
                let _price = serviceData[row][place].price;
                if (_price) _priceArray.push(_price);
            }
        }
        const _minPrice = Math.min.apply(null, _priceArray);
        _textMinPriceEl.text(`${lajax.t('от')}: ${_minPrice} ${lajax.t('грн')}`);
    } else {
        _textMinPriceEl.parents('.item-additional-link').hide();
    }
}

function parseDateforRequest(date) { // 31.12.2019
    const dataArr = date.split('.');

    return `${dataArr[2]}-${dataArr[1]}-${dataArr[0]}`;
}

function parseDate(date) {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; // месяц 1-12
    var yyyy = date.getFullYear();
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;

    return `${dd}.${mm}.${yyyy}`;
}

function parseString(date) { // 2021-01-30
    if (date) {
        const _date = new Date(date);
        if (_date.toString() === 'Invalid Date') {
            return ''
        }
        ;
        return parseDate(_date);
    } else {
        return '';
    }
}

function blockAdditionalPage() {
    if (formValid) {
        $('.good-box').removeClass('not-valid');
        $('#all-passengers-info').show();
        $('#all-passengers-info-error-form').hide();
        updatePassengerInfoBlocks();
        setTimeout(function () {
            $('.plane-wrap').addClass('can-choose');
        }, 1100)
    } else {
        $('.good-box').addClass('not-valid');
        $('#all-passengers-info').hide();
        $('#all-passengers-info-error-form').show();
        setTimeout(function () {
            $('.plane-wrap').removeClass('can-choose');
        }, 1100)
    }
}

function showGoodControl(el) {
    if(formValid) {
        const controlWrapEl = $(el).parent().children( ".good-box-control" );
        controlWrapEl.children('.button-count-plus').click();
        $(el).hide();
        controlWrapEl.css('display', 'flex');
    } else {
        const error = {message: `${lajax.t('Сначала нужно заполнить данные о пассажирах')}`}
        showErrorStatusModal(error);
    }
}

/**********************
 promocode
 **********************/

function send_promo() {
    var msg = $("#promocode").val();
    $.ajax({
        type    : "POST",
        url     : baseUrl + "/api/order/get-success-code",
        data    : {promocode: msg},
        dataType: "json",
        success : function (data) {
            if (data.discount != 0) {
                tiketDiscount = data.discount;
                $("#promo_text").text(`${lajax.t('Скидка')} ${tiketDiscount} ${lajax.t('грн')}`);
                $("#promo-wrap").hide();
                $("#promo-del-wrap").show();
                totalSumm();
            } else {
                alert(lajax.t('Промокод неактивен или не существует'));
            }
        },
        error   : function (data) {
            alert(lajax.t('Промокод неактивен или не существует'));
        },
    });
}

function promo_del() {
    tiketDiscount = null;
    $("#promo-wrap").show();
    $("#promo-del-wrap").hide();
    $("#promo_label").text("");
    totalSumm();
}


/**********************
 payment
 **********************/
function liqPayInit(data) {
    if (liqRes) {
        liqRes = LiqPayCheckout.init({
            data     : data.data,
            signature: data.sign,
            embedTo  : "#liqpay_checkout",
            mode     : "embed" // embed || popup
        });
    } else {
        liqRes = LiqPayCheckout.init({
            data     : data.data,
            signature: data.sign,
            embedTo  : "#liqpay_checkout",
            mode     : "embed" // embed || popup
        }).on("liqpay.callback", (data1) => {
            successPayment(data);

            // $('#modal-pay #our-fin-text').show();
            // finBuy = 1;

        }).on("liqpay.ready", function (data) {
            $('#modal-pay .load-filters').hide();
            $('#modal-pay .system-loading').hide();

            console.log('READY');
        }).on("liqpay.close", function (data) {
            console.log('close');
        });
    }
    // alert('Количество доступных мест изменилось. Мы выполним актуальный поиск предложений по вашему запросу');
};

/*******************fondy*****************/

var checkoutStyles = {
    'html , body'                           : {
        'overflow': 'hidden'
    },
    '.input_suggest .arrow'                 : {
        'display': 'none'
    },
    '[name="card_number"]'                  : {
        'width': '320px !important'
    },
    '.pages-checkout .page-section-shopinfo': {
        'background': 'transparent'
    },
    '.col.col-shoplogo'                     : {
        'display': 'none'
    },
    '.col.col-language'                     : {
        'display': 'none'
    },
    '.pages-checkout'                       : {
        'background': 'transparent'
    },
    '.col.col-login'                        : {
        'display': 'none'
    },
    '.pages-checkout .page-section-overview': {
        'background'   : '#fff',
        'color'        : '#252525',
        'border-bottom': '1px solid #dfdfdf'
    },
    '.col.col-value.order-content'          : {
        'color': '#252525'
    },
    '.page-section-footer'                  : {
        'display': 'none'
    },
    '.page-section-tabs'                    : {
        'display': 'none'
    },
    '.btn-row'                              : {
        'margin': '20px'
    },
    '#submit_button_row'                    : {
        'display': 'none'
    },
    '.btn-block'                            : {
        'font-size'  : '18px',
        'line-height': '50px',
    }
};

const fondyHtml = `
    <div id="checkout_fondy_header">
        Shop Checkout
    </div>
    <div id="checkout_fondy_wrapper">
        <div id="checkout_fondy_loader"><div class="loader">Loading</div></div>
    </div>
    <div id="checkout_fondy_message">Sample Footer Message</div>
    <div id="checkout_fondy_button" onclick="$ipsp('checkout').send('submit')">Pay</div>
`;

function fondyCallbackDefault(paymentData) {
    var form;
    console.log('action', data.action);
    console.log('url', data.url)
    for (var prop in data.send_data) {
        if (data.send_data.hasOwnProperty(prop)) {
            console.log(prop, data.send_data[prop]);
        }
    }
    if (data.error) {
        console.log(data, data.error);
        return;
    }
    if (data.action == 'redirect') {
        this.loadUrl(data.url);
        return;
    }
    if (data.send_data.order_status == 'delayed') {
        this.unbind('ready');
        this.hide();
        return;
    } else {
        this.unbind('ready').action('ready', function () {
            this.show();
        });
    }
    if (data.send_data && data.url) {
        form = prepareFormData(data.url, data.send_data);
        this.find('body').appendChild(form);
        form.submit();
        form.parentNode.removeChild(form);
    }
}

function fondyCheckoutInit(url, paymentData) {
    $ipsp('checkout').scope(function () {
        this.setCheckoutWrapper('#checkout_fondy_wrapper');
        this.addCallback((data)=>{
            if (!data.error){
                successPayment(paymentData)
            }
        }); // callback
        this.setModal(false);
        this.setCssStyle(checkoutStyles);
        this.action('show', function (data) {
            $('#checkout_fondy_loader').remove();
            $('#checkout_fondy').show();
            $('#modal-pay .load-filters').hide();
            $('#modal-pay .system-loading').hide();
            $('#modal-pay .payment-loading').hide();
        });
        this.action('hide', function (data) {
            $('#checkout_fondy').hide();
        });
        this.action('resize', function (data) {
            $('#checkout_fondy_wrapper').height(data.height);
        });
        this.loadUrl(url);
    });
};


function fondyInit(paymentData) {
    $('#checkout_fondy').append(fondyHtml);
    let button = $ipsp.get('button');
    button.setMerchantId(paymentData.MerchantId);
    button.setAmount(paymentData.Amount, paymentData.Currency, true);
    button.setResponseUrl(paymentData.ResponseUrl);
    button.setHost('api.fondy.eu');  // ?
    button.addField({
        label   : paymentData.descriptionLabel,
        name    : 'descr',
        value   : paymentData.description,
        readonly: true
    });
    button.addParam('order_id', paymentData.orderId);
    button.addParam('lang', lang);
    button.addParam('preauth', 'Y');

    $('#checkout_loader').append(button.getButton('Open checkout in new window', '', '_blank'));
    fondyCheckoutInit(button.getUrl(), paymentData);
}

function successPayment(paymentData) {
    $('#modal-pay .load-filters').show();
    $('#modal-pay .payment-loading').show();
    checkServerStatus(paymentData);
    closePaymentModal();
}

function failPayment(data) {
    let dataTest = {
        result     : 'что такое результ?',
        status_code: 500, // data.status,
        message    : lajax.t('Произошла ошибка при оплате. Попробуйте повторить оплату еще раз.')
    }
    showErrorStatusModal(dataTest);

    console.log('Error payment Server status');
}

function checkServerStatus(data) {
    const _dataPayment = {order_id: data.order_id};
    $.post(data.order_check_url, _dataPayment)
    .done(function (response) {
        if(response.status === 'hold' || response.status === 'success') { //status
            closePaymentModal();
            window.open('https://www.google.com.ua/', "_blank");
            window.location.replace(data.thank_you_page_url);
        } else if(response.status === 'started' || response.status === 'processing') {
            setTimeout(()=>{
                checkServerStatus(data)
            }, 5000);
        } else {
            failPayment(response);
        }
    })
    .fail(function (response) {
        failPayment(response);
    });
}


function closePaymentModal() {
    $('#liqpay_checkout').text('');
    $('#checkout_fondy').text('');
    $('#buy-buttons').removeClass('disabled-buttons');
    delete orderForm.orderId;
    delete orderForm.paymentMethod;
}
/**********************
 init
 **********************/

if(!isAdditionalData) {
    $('#additional-services-button').hide();
    $('#total-sum-details').hide();
}

setTimeout(() => {
    updateClientDataFields();
    updatePassengerFields();
}, 100)

