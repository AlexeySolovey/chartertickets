<div class="order-page">
    <div class="order-header">
        <a class="btn btn-primary"
            id="link_for_search"
            href="https://test.chartertickets.com.ua/?type=round_way&country_from=albania&city_from=tirana&country_to=ukraine&city_to=kiev&date_from=2021-05-29&date_to=2021-05-31&adults=1&children=0&childes=0&schema="
            style="margin:10px">Вернуться к поиску
        </a>
        <!-- <div class="result-data" id="page-info" style="display: none;" data-show-welcome="0" data-result-expired-at="1615891323" data-fly-property-to-id="78895825" data-count-adults="1" data-count-children="0" data-count-childes="0"></div> -->
        
        
        <!-- BUS_KBP -->
        <div class="result-data" id="page-info" style="display: none;" data-show-welcome="0" data-fly-property-to-id="112877038" data-result-expired-at="1615891323" data-count-adults="1" data-count-children="0" data-count-childes="0"></div>
        <!-- <span class="float-right">
            timer:  <div id="expirationTimer"></div>
        </span> -->
    </div>
    

    <?php include 'step-first.php'; ?>
    <?php include 'step-second.php'; ?>

    

    <!--footer block-->

    <div class="order-footer">
        <div class="row">
            <button type="submit" id="additional-services-button" class="btn btn-primary disabled">
                Перейти к выбору доп услуг
            </button>
            <button class="btn btn-primary" id="return-to-passengers">
                Данные пассажиров
            </button>
        </div>
        <div class="row" id="buy-buttons">
            <button type="button" class="btn btn-success button-buy" data-method="LiqPay">
                Оплатить картой украинского банка
            </button>
            <button type="button" class="btn btn-success button-buy" data-method="Fondy">
                Оплатить картой иностранного банка
            </button>
            <button type="button" class="btn btn-success button-buy" data-method="Portmone">
                Оплатить картой иностранного банка
            </button>
        </div>
    </div>
</div>