@echo off
echo ========================================
echo   Iniciando Backend del Sistema ERP
echo ========================================
echo.

cd backend

echo Verificando Maven...
mvn --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven no esta instalado
    echo Por favor instala Maven o usa un IDE como IntelliJ IDEA
    pause
    exit /b 1
)

echo Maven detectado correctamente
echo.
echo Compilando y ejecutando Spring Boot...
echo Esto puede tomar unos minutos la primera vez...
echo.
echo El backend estara disponible en http://localhost:3000
echo ========================================
echo.

mvn spring-boot:run

pause
