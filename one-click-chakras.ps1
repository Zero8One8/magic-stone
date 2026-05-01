param(
    [switch]$SkipNpmInstall
)

Set-Location -Path $PSScriptRoot

Write-Host "[1/5] Проверка входного JSON..."
if (-not (Test-Path "content-import/chakras-pack.json")) {
    Write-Host "Файл content-import/chakras-pack.json не найден."
    Write-Host "Создаю копию из шаблона..."
    Copy-Item "content-import/chakras-pack.template.json" "content-import/chakras-pack.json" -Force
    Write-Host "Готово. Откройте content-import/chakras-pack.json и заполните текст."
    Write-Host "Положите 7 фото в content-import/images и запустите скрипт снова."
    exit 0
}

if (-not $SkipNpmInstall) {
    Write-Host "[2/5] Установка зависимостей (если нужно)..."
    npm install
}

Write-Host "[3/5] Импорт текстов и фото чакр..."
npm run import:chakras
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "[4/5] Жесткая маркировка фото + сборка..."
$env:NODE_OPTIONS = "--max-old-space-size=4096"
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "[5/5] Создание архива фото для канала..."
if (Test-Path "channel-images-watermarked.zip") {
    Remove-Item "channel-images-watermarked.zip" -Force
}
Compress-Archive -Path "public/channel-images/*" -DestinationPath "channel-images-watermarked.zip" -CompressionLevel Optimal

Write-Host "Готово."
Write-Host "Архив для канала: channel-images-watermarked.zip"
Write-Host "Теперь можно делать commit/push."
