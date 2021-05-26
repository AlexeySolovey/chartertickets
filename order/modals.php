<!-- Modal PAY -->
<div class="modal fade" id="modal-pay" tabindex="-1" role="dialog" aria-labelledby="modalPayLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title" id="modalPayLabel">Оплата <b class="full_order_price">
                        6 165 грн</b><span id="promo_label"></span> <span style="color: red">- дополнительные сборы
                        отсутствуют</span></h4>
            </div>
            <div class="modal-body">
                <i class="load-filters fa fa-cog fa-spin fa-5x"></i>
                <p class="system-loading">Ожидание платежной системы</p>
                <p class="payment-loading">Ваш платеж обрабатывается</p>
                <div id="our-fin-text">
                    <p>Спасибо за обращение в нашу компанию.</p>
                    <p>Ваш заказ принят в работу и будет обработан в течение нескольких минут. Подтверждение будет
                        выслано на указанный Вами e-mail в течение 12 часов. Если вы не нашли письма на почте -
                        проверьте папку спама. </p>
                </div>
                <!-- платежные системы -->
                <div id="liqpay_checkout"></div>

                <div id="checkout_fondy"></div>

            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
</div>


<div class="modal fade modal-wellcome" id="modal-wellcome" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title">Добро пожаловать! </h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <i class="fa fa-paper-plane-o img"></i>
                    </div>
                    <div class="col-md-6">
                        <h5>Расписание работы:</h5>
                        <ul>
                            <li>Пн. 9.00-18.00</li>
                            <li>Вт. 9.00-18.00</li>
                            <li>Ср. 9.00-18.00</li>
                            <li>Чт. 9.00-18.00</li>
                            <li>Пн. 9.00-18.00</li>
                            <li>Сб. Вс Выходной</li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="contact">
                            <h5>Наши контактные данные:</h5>
                            <div>
                                <i class="fa fa-map-marker"></i>
                                <span>г.Киев ул.Соломии Крушельницкой 15/43</span>
                            </div>
                            <div>
                                <i class="fa fa-phone"></i>
                                <span>+38(067)123-45-67</span>
                            </div>
                            <div>
                                <i class="fa fa-envelope"></i>
                                <span>some.email@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Хорошо</button>
            </div>
        </div>
    </div>
</div>



<div class="modal fade" id="modal-redirect" tabindex="-1" role="dialog" aria-labelledby="modalRedirectLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">×</span>
                </button>
                <h4 class="modal-title">Redirect window</h4>
            </div>
            <div class="modal-body">
                <i class="load-filters fa fa-cog fa-spin fa-5x"></i>
                <div>
                    <p>Спасибо за обращение в нашу компанию.
                    </p>
                    <p>Проверка заказа </p>
                </div>
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="modal-form-order-error" tabindex="-1" role="dialog" aria-labelledby="modalRedirectLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <span id='modal-order-error-close-wrap'></span>
                <h4 class="modal-title">Request Error</h4>
            </div>
            <div class="modal-body">
                <i class="error-icon fa fa-exclamation-triangle fa-5x"></i>
                <h5 class="error-status"></h5>
                <div class="error-message"></div>
            </div>
            <div class="modal-footer" id="modal-error-footer"></div>
        </div>
    </div>
</div>