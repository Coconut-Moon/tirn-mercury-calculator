<?php
    require_once(dirname(__FILE__) . '/wp-config.php');
    $wp->init();
    $wp->parse_request();
    $wp->query_posts();
    $wp->register_globals();
    $wp->send_headers();

    // Your WordPress functions here...
    echo site_url();
?>


<h1>Hello world!</h1>
