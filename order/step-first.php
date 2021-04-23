<div id="order-first-step">
    <?php include 'tiket-header.php'; ?>
    <div id="ticket-ways">
        <div class="ticket-there">
            <div class="ticket-there-header">
                <i class="fa fa-plane fa-lg"></i>
                Вылет туда 
            </div>

            <?php include 'tiket-table1.php'; ?>
        
        </div>
        <div class="ticket-return">
            <div class="ticket-return-header">
                <i class="fa fa-plane fa-lg fa-rotate-180"></i>
                Вылет обратно </div>
                <?php include 'tiket-table2.php'; ?>
        </div>
    </div>
    
    <div class="passenger-data-block" id="contact-data-block">
        <h3>Контактные данные</h3>
        <div class="row">
            <div class="fields-block">
                <div class="col-md-3 col-sm-6">
                    <div class="form-group">
                        <label for="mail">Эл.почта</label>
                        <span class="required">*</span>
                        <input type="text" class="form-control untouched" id="mail" data-order-type="email" >
                        <span class="error-text" id="error-email"></span>
                    </div>
                </div>
                <!-- Example split danger button -->
                <div class="col-md-3 col-sm-6">
                    <div class="form-group">
                        <label for="contact-phone">
                            Номер телефона
                            <span class="required">*</span>
                        </label>
                        <div class="country-phone">
                            <div class="country-phone-selector">
                                <div class="country-phone-selected" id="country-phone-selector">
                                    <img class="flag flag-ua" />
                                    <span id="phone-selector-code">+380</span>
                                </div>
                                <!-- dropdawn -->
                                <div class="country-phone-options" id="country-phone-options">
                                    <input type="text" class="form-control" placeholder="Введите страну" id="country-phone-search" oninput="createPhoneList(this.value)"/>
                                    <div id="phone-list"></div>
                                </div>
                            </div>
                            <input type="text" class="form-control untouched" id="contact-phone" placeholder="990000000" data-order-type="phone">
                        </div>
                        <span class="error-text" id="error-phone"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="passenger-data-block passenger-people" id="passenger-block"></div>

    <div class="rule-block">
        <div class="row">
            <div class="col-md-12">
                <div class="rule-item">
                    <input type="checkbox" id="rules">
                    <label class="agreement" for="rules">
                        <b> Согласие с правилами бронирования</b>
                    </label>
                    <span class="btn btn-primary rulesModal" onclick="$('#rulesModal').modal('show')">
                        Ознакомиться с правилами
                    </span>
                    <div class="clearfix"></div>
                    <span class="error-text error-rules" id="error-rules"></span>
                </div>
            </div>
            
            <div class="modal fade" id="rulesModal" tabindex="-1" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h3 class="modal-title" id="myModalLabel">
                                Правила и условия бронирования
                            </h3>
                        </div>
                        
                        <div class="modal-body" style="text-align: left">
                            <p>Внимательно прочтите указанную ниже информацию перед бронированием! Совершение бронирования означает
                                Ваше согласие с указанными ниже правилами.
                            </p>
                            <p>Наша компания осуществляет продажу билетов на чартерные авиарейсы и регулярные рейсы, выкупленные
                            блоки мест на регулярных авиарейсах, а также на рейсы лоу-кост авиакомпаний. По общим правилам эти
                            билеты являются
                            невозвратными: обмену, замене и возврату не подлежат! Изменение в написании фамилии, имени
                            пассажиров, а также даты рождения и других указанных данных, по общему правилу, не допускается.
                            Такая возможность может либо отсутствовать полностью, либо предоставляться за дополнительную плату,
                            поэтому просим быть максимально внимательными при введении паспортных данных и проверять внесенную
                            информацию.
                            </p>
                            <p>Бронируя билеты Вы несёте ответственность за все внесенные Вами данные и подтверждаете наличие у Вас
                            въездных виз и других документов, необходимых для совершения поездки. Вы подтверждаете, что
                            ознакомлены с визовым и пограничным режимом страны следования и обязуетесь соблюдать все правила. В
                            случае внесения ошибочных данных при бронировании/отсутствия необходимых разрешительных документов
                            для путешествия Вам может быть отказано в посадке на борт воздушного судна.
                            </p><p>Ответственность за достоверность предоставляемой информации возлагается на покупателя.
                            </p><p>Компания-перевозчик, осуществляющая авиарейс может потребовать предоставления документов разрешающих
                            въезд/пребывание в странах, посещаемых по маршруту. Отказ от предоставления таких документов может
                            повлечь аннуляцию забронированного авиабилета.
                            </p><p>По общим правилам маршрутная квитанция на чартерных рейсах выписывается за 2 дня до даты вылета и
                            высылается на электронный адрес, указанный при бронировании билета/ов.
                            </p><p>На рейсах в Гоа и Таиланд действуют ограничения, согласно которым пассажиры, прилетевшие чартерным
                            рейсом, могут вернуться только на чартерных рейсах той же авиакомпании. В посадке на чартерные рейсы
                            других авиакомпаний и регулярные рейсы им может быть отказано. В случае если пассажиры прилетели
                            регулярным рейсом, обратно им необходимо вылетать также регулярным рейсом.
                            </p><p>В связи с ограничениями введёнными законодательством Египта, на чартерные рейсы из Египта допускаются
                            пассажиры, находившиеся на территории страны не более 28 дней. При этом обратный вылет должен
                            осуществляться из того же аэропорта, куда и прилетали пассажиры.
                            </p><p>По общему правилу гражданам Египта не разрешается использовать чартерные рейсы в/из Египта. Бронируя
                            данные направления такие туристы самостоятельно несут за это ответственность и в случае отказа в
                            посадке на рейс или проблем с прохождением пограничного контроля - претензии от них приниматься не
                            будут.
                            </p><p>На чартерных рейсах возможно изменение авиакомпании, аэропорта и времени вылета/прилёта.
                            Авиаперевозчик и мы не несём ответственности за подобного рода изменения. В случае отмены рейса,
                            заказчику возвращается стоимость оплаченных билетов, при этом стоимость заказанных и оплаченных
                            услуг у третьих лиц (забронированные отели, трансферы и др.) нами не компенсируется. Актуальное
                            расписание пассажирам необходимо уточнять за сутки до вылета связавшись с нашей компанией по
                            контактам указанным на сайте.
                            </p><p>При оплате картой на сайте деньги с Вашего карточного счёта не списываются до подтверждения
                            бронирования от авиакомпании. В некоторых случаях возможно неподтверждение авиабилетов, в таком
                            случае деньги будут возвращены Вам на карточный счёт в срок до 30 дней. Эта процедура осуществляется
                            платёжной системой, не зависит от нашей компании и мы никак не можем на неё повлиять.
                            </p><p>Пассажиры в возрасте до 16 лет должны сопровождаться пассажиром от 18 лет и старше. Пассажиру в
                            возрасте до двух лет место не предоставляется. Каждого пассажира в возрасте до двух лет должен
                            сопровождать взрослый пассажир.
                            </p>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">
                            Закрыть                
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="rule-item">
                    <input type="checkbox" id="rules-egypt">
                    <label class="agreement" for="rules-egypt">
                        <b> Согласие с правилами бронирования Egypt</b>
                    </label>
                    <div class="clearfix"></div>
                    <span class="error-text error-rules" id="error-rules-egypt"></span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="rule-item">
                    <input type="checkbox" id="rules-partner">
                    <label class="agreement" for="rules-partner">
                        <b> Согласие с правилами бронирования Partner</b>
                    </label>
                    <div class="clearfix"></div>
                    <span class="error-text error-rules" id="error-rules-partner"></span>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- / first block-->