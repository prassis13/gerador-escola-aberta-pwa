@echo off
title Gerador Escola Aberta PWA - Servidor Local
echo ========================================================
echo   INICIANDO SERVIDOR DO GERADOR ESCOLA ABERTA PWA
echo ========================================================
echo.
echo  Acesse no seu navegador:
echo  - Computador: http://localhost:4000
echo  - Celular no Wi-Fi: http://192.168.0.4:4000
echo.
echo  Pressione Ctrl+C para encerrar o servidor.
echo ========================================================
echo.
cd /d "%~dp0"
node server.cjs
pause
