// Módulo de Consultar Asistencia
const consultarAsistencia = {
    trabajadorSeleccionado: null,
    paginaActual: 1,
    registrosPorPagina: 50,
    totalRegistros: 0,

    // Inicializar el módulo
    init: function() {
        console.log('✅ Módulo Consultar Asistencia inicializado');
        this.configurarFechas();
        this.configurarEventos();
    },

    // Configurar fechas por defecto (mes actual)
    configurarFechas: function() {
        const hoy = new Date();
        const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);
        
        $('#filtroFechaDesdeConsulta').val(this.formatearFecha(primerDia));
        $('#filtroFechaHastaConsulta').val(this.formatearFecha(ultimoDia));
    },

    // Formatear fecha a YYYY-MM-DD
    formatearFecha: function(fecha) {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // Configurar eventos
    configurarEventos: function() {
        const self = this;
        
        // Botón buscar trabajador
        $(document).off('click', '#btnBuscarDoc').on('click', '#btnBuscarDoc', function() {
            self.buscarTrabajador();
        });
        
        // Enter en campo de documento
        $(document).off('keypress', '#filtroNroDoc').on('keypress', '#filtroNroDoc', function(e) {
            if (e.which === 13) {
                self.buscarTrabajador();
            }
        });
        
        // Botón Consultar
        $(document).off('click', '.btn-consultar-asistencia-detalle').on('click', '.btn-consultar-asistencia-detalle', function() {
            self.paginaActual = 1;
            self.consultar();
        });
        
        // Botones de paginación
        $(document).off('click', '#btnAnteriorConsulta').on('click', '#btnAnteriorConsulta', function() {
            if (self.paginaActual > 1) {
                self.paginaActual--;
                self.consultar();
            }
        });
        
        $(document).off('click', '#btnSiguienteConsulta').on('click', '#btnSiguienteConsulta', function() {
            const totalPaginas = Math.ceil(self.totalRegistros / self.registrosPorPagina);
            if (self.paginaActual < totalPaginas) {
                self.paginaActual++;
                self.consultar();
            }
        });
    },

    // Buscar trabajador por documento
    buscarTrabajador: async function() {
        const nroDoc = $('#filtroNroDoc').val().trim();
        
        if (!nroDoc) {
            showNotification('Ingrese un número de documento', 'warning');
            return;
        }
        
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const response = await fetch(`http://localhost:3000/api/trabajadores/buscar-por-documento?numeroDocumento=${nroDoc}&empresaId=${empresaId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.trabajadorSeleccionado = result.data;
                const nombreCompleto = `${result.data.apellidoPaterno || ''} ${result.data.apellidoMaterno || ''} ${result.data.nombres || ''}`.trim();
                $('#filtroNombreCompleto').val(nombreCompleto);
                showNotification('Trabajador encontrado', 'success');
            } else {
                this.trabajadorSeleccionado = null;
                $('#filtroNombreCompleto').val('');
                showNotification('Trabajador no encontrado', 'warning');
            }
        } catch (error) {
            console.error('Error al buscar trabajador:', error);
            showNotification('Error al buscar trabajador', 'danger');
        }
    },

    // Consultar asistencias del trabajador
    consultar: async function() {
        if (!this.trabajadorSeleccionado) {
            showNotification('Debe buscar un trabajador primero', 'warning');
            return;
        }
        
        const fechaDesde = $('#filtroFechaDesdeConsulta').val();
        const fechaHasta = $('#filtroFechaHastaConsulta').val();
        
        if (!fechaDesde || !fechaHasta) {
            showNotification('Debe seleccionar rango de fechas', 'warning');
            return;
        }
        
        try {
            const empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
            const url = `http://localhost:3000/api/asistencias/consultar-trabajador?` +
                `trabajadorId=${this.trabajadorSeleccionado.id}&` +
                `empresaId=${empresaId}&` +
                `fechaDesde=${fechaDesde}&` +
                `fechaHasta=${fechaHasta}`;
            
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.totalRegistros = result.data.length;
                this.renderizarTabla(result.data);
                this.calcularTotales(result.data);
            } else {
                this.renderizarTabla([]);
                this.calcularTotales([]);
                showNotification('No se encontraron registros', 'info');
            }
        } catch (error) {
            console.error('Error al consultar asistencias:', error);
            showNotification('Error al cargar asistencias', 'danger');
            this.renderizarTabla([]);
        }
    },

    // Renderizar tabla
    renderizarTabla: function(datos) {
        const tbody = $('#tablaConsultarAsistencia tbody');
        tbody.empty();
        
        if (datos.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="18" class="text-center text-muted py-4">
                        No hay datos disponibles
                    </td>
                </tr>
            `);
            return;
        }
        
        datos.forEach((registro, index) => {
            // Formatear fecha y obtener día
            const fecha = registro.fecha || '-';
            let diaNombre = '-';
            if (fecha !== '-') {
                const fechaObj = new Date(fecha + 'T00:00:00');
                diaNombre = this.obtenerNombreDia(fechaObj);
            }
            
            const fila = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${fecha}</td>
                    <td>${diaNombre}</td>
                    <td>${registro.sede || '-'}</td>
                    <td>${registro.turno || '-'}</td>
                    <td>${registro.asistio ? 'Sí' : 'No'}</td>
                    <td>${registro.diaferiado ? 'Sí' : 'No'}</td>
                    <td>${registro.trabajoferiado ? 'Sí' : 'No'}</td>
                    <td>${registro.diadescanso ? 'Sí' : 'No'}</td>
                    <td>${registro.comprodescanso ? 'Sí' : 'No'}</td>
                    <td>No</td>
                    <td>No</td>
                    <td>No</td>
                    <td>${registro.horaentrada || '-'}</td>
                    <td>${registro.horaingreso || '-'}</td>
                    <td>${registro.horatardanza || '-'}</td>
                    <td>-</td>
                    <td>${registro.observacion || '-'}</td>
                </tr>
            `;
            tbody.append(fila);
        });
        
        $('#infoRegistrosConsulta').text(`Mostrando ${datos.length} registros`);
    },

    // Obtener nombre del día
    obtenerNombreDia: function(fecha) {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        return dias[fecha.getDay()];
    },

    // Calcular totales
    calcularTotales: function(datos) {
        const totales = {
            asistio: 0,
            feriado: 0,
            trabajoFeriado: 0,
            diaDescanso: 0,
            comproDescanso: 0,
            vacaciones: 0,
            subsidiado: 0,
            noSubsidiado: 0
        };
        
        datos.forEach(registro => {
            if (registro.asistio) totales.asistio++;
            if (registro.diaferiado) totales.feriado++;
            if (registro.trabajoferiado) totales.trabajoFeriado++;
            if (registro.diadescanso) totales.diaDescanso++;
            if (registro.comprodescanso) totales.comproDescanso++;
        });
        
        $('#totalAsistio').text(totales.asistio);
        $('#totalFeriado').text(totales.feriado);
        $('#totalTrabajoFeriado').text(totales.trabajoFeriado);
        $('#totalDiaDescanso').text(totales.diaDescanso);
        $('#totalComproDescanso').text(totales.comproDescanso);
        $('#totalVacaciones').text(totales.vacaciones);
        $('#totalSubsidiado').text(totales.subsidiado);
        $('#totalNoSubsidiado').text(totales.noSubsidiado);
    }
};

// Inicializar cuando el documento esté listo
$(document).ready(function() {
    console.log('📦 Módulo consultar-asistencia.js cargado');
    
    // Intentar inicializar si la tabla ya existe
    if ($('#tablaConsultarAsistencia').length > 0) {
        console.log('✅ Tabla encontrada, inicializando módulo...');
        consultarAsistencia.init();
    }
});

// Observador para detectar cuando se carga el módulo dinámicamente
const observerConsultarAsistencia = new MutationObserver(function(mutations) {
    if ($('#tablaConsultarAsistencia').length > 0) {
        console.log('✅ Tabla detectada dinámicamente, inicializando módulo...');
        observerConsultarAsistencia.disconnect();
        consultarAsistencia.init();
    }
});

// Observar cambios en el contenedor principal
if (document.querySelector('main')) {
    observerConsultarAsistencia.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
