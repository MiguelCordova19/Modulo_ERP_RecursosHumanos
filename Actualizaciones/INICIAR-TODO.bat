@echo off
echo ========================================
echo   Sistema ERP - Inicio Completo
echo ========================================
echo.
echo Este script iniciara:
echo   1. Backend (Spring Boot) en puerto 3000
echo   2. Frontend (Node.js) en puerto 5500
echo.
echo Se abriran dos ventanas de terminal
echo ========================================
echo.

echo Iniciando Backend...
start "ERP Backend" cmd /k "cd backend && mvn spring-boot:run"

timeout /t 3 /nobreak >nul

echo Iniciando Frontend...
start "ERP Frontend" cmd /k "cd frontend && node server.js"

echo.
echo ========================================
echo   Ambos servicios se estan iniciando
echo ========================================
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5500
echo.
echo Accede a: http://localhost:5500/login.html
echo Usuario: admin
echo Password: admin123
echo.
pause
