<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Оплата прошла успешно — Magic Stone</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
        .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        h1 { color: #28a745; }
    </style>
</head>
<body>
    <div class="container">
        <h1>✅ Оплата прошла успешно!</h1>
        <p>Спасибо за покупку в Magic Stone!</p>
        <p>Номер заказа: <strong><?= htmlspecialchars($_GET['o'] ?? '—') ?></strong></p>
        <br>
        <a href="https://magic-stone.org/delivery?o=<?= urlencode($_GET['o'] ?? '') ?>" style="display:inline-block; padding:12px 30px; background:#198754; color:white; text-decoration:none; border-radius:8px; font-size:18px; margin-right:8px;">
            Оформить доставку
        </a>
        <a href="https://magic-stone.org/shop" style="display:inline-block; padding:12px 30px; background:#6f42c1; color:white; text-decoration:none; border-radius:8px; font-size:18px;">
            Вернуться в магазин
        </a>
    </div>
</body>
</html>
