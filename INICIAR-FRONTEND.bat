@echo off
echo ========================================
echo   Iniciando Frontend del Sistema ERP
echo ========================================
echo.

cd frontend

echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detectado correctamente
echo.
echo Iniciando servidor en http://localhost:5500
echo.
echo Presiona Ctrl+C para detener el servidor
echo ========================================
echo.

node server.js

pause
