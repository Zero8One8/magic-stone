<?php
// ==================== НАСТРОЙКИ ====================
$merchant_id   = '72550';
$secret_word2  = 'D_!AklzhJ7nGS,@';

// ==================== ПРОВЕРКА IP ====================
$allowed_ips = ['168.119.157.136', '168.119.60.227', '178.154.197.79', '51.250.54.238'];
$client_ip = $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'];

if (!in_array($client_ip, $allowed_ips)) {
    http_response_code(403);
    die('Access denied');
}

// ==================== ПРОВЕРКА ПОДПИСИ ====================
$sign = md5(
    $_REQUEST['MERCHANT_ID'] . ':' .
    $_REQUEST['AMOUNT'] . ':' .
    $secret_word2 . ':' .
    $_REQUEST['MERCHANT_ORDER_ID']
);

if ($sign !== $_REQUEST['SIGN']) {
    die('Wrong signature');
}

// ==================== ОБРАБОТКА ЗАКАЗА ====================
$order_id = $_REQUEST['MERCHANT_ORDER_ID'];
$amount   = $_REQUEST['AMOUNT'];
$intid    = $_REQUEST['intid'];

// TODO: добавить запись в базу данных / обновление статуса заказа
// Например: обновить статус заказа на "оплачен", начислить товар и т.д.

// ==================== ВЕРНУТЬ YES ====================
echo 'YES';
