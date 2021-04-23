<?php include 'header.php'; ?>

<body id="page-top" data-spy="scroll" data-target=".navbar-fixed-top" data-new-gr-c-s-check-loaded="14.984.0"
    data-gr-ext-installed="">
    <div id="fb-root" class=" fb_reset">
        <div style="position: absolute; top: -10000px; width: 0px; height: 0px;">
            <div></div>
        </div>
    </div>
    <script>window.fbAsyncInit = function () { FB.init({ appId: '1676732502390699', autoLogAppEvents: true, xfbml: true, version: 'v8.0' }); }; (function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) { return; } js = d.createElement(s); js.id = id; js.src = "https://connect.facebook.net/en_US/sdk.js"; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk'));</script>
    <!-- Navigation -->
    <nav class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header page-scroll">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand page-scroll" href="https://chartertickets.com.ua/">
                    <i class="fa fa-paper-plane-o fa-2x"></i>
                    CharterTickets
                </a>
            </div>
            <div class="collapse navbar-collapse navbar-ex1-collapse">
                <ul class="nav navbar-nav">
                    <li class="hidden active">
                        <a class="page-scroll"
                            href="https://chartertickets.com.ua/order_ticket.php?reference-id-online=41&amp;schema=#page-top"></a>
                    </li>
                    <li>
                        <a class="page-scroll" href="https://chartertickets.com.ua/">Бронирование</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="https://chartertickets.com.ua/tickets_on_request.php">Билеты под
                            запрос</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="https://chartertickets.com.ua/rules.php">Условия и правила</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="https://chartertickets.com.ua/collaboration.php">Сотрудничество</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="https://chartertickets.com.ua/contacts.php">Контакты</a>
                    </li>
                    <li>
                        <a class="page-scroll" href="https://chartertickets.com.ua/reviews.php">Отзывы</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container content">
        <?php include 'main.php'; ?>
    </div>


    <?php include 'modals.php' ?>
    <?php include 'footer.php' ?>