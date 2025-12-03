// Módulo de Registro de Planilla
const registroPlanilla = {
    empresaId: null,
    trabajadores: [],
    paginaActual: 1,
    registrosPorPagina: 10,

    init: function() {
        console.log('✅ Módulo Registro de Planilla inicializado');
        this.empresaId = localStorage.getItem('empresa_id') || window.EMPRESA_ID || 1;
        this.configurarEventos();
        this.cargarCombos();
        this.establecerFechaActual();
    },
    
    establecerFechaActual: function() {
        const hoy = new Date();
        const fechaStr = hoy.toISOString().split('T')[0];
        const year = hoy.getFullYear();
        const month = String(hoy.getMonth() + 1).padStart(2, '0');
        
        $('#fechaRegistroPlanilla').val(fechaStr);
        $('#periodoRegistroPlanilla').val(`${year}-${month}`);
    },

    configurarEventos: function() {
        const self = this;
        
        $('#btnVolverPlanilla').off('click').on('click', () => {
            if (typeof loadModuleContent === 'function') {
                loadModuleContent('generar-planilla', 'Planilla');
            } else {
                console.error('❌ Función loadModuleContent no encontrada');
                showNotification('Error al volver', 'danger');
            }
        });
        
        $('#btnGenerarMostrarPlanilla').off('click').on('click', () => self.generarMostrar());
        
        $('#registrosPorPaginaRegistroPlanilla').off('change').on('change', function() {
            self.registrosPorPagina = parseInt($(this).val());
            self.paginaActual = 1;
            self.renderizarTabla();
        });
        
        $('#btnAnteriorRegistroPlanilla').off('click').on('click', () => {
            if (self.paginaActual > 1) {
                self.paginaActual--;
                self.renderizarTabla();
            }
        });
        
        $('#btnSiguienteRegistroPlanilla').off('click').on('click', () => {
            const totalPaginas = Math.ceil(self.trabajadores.length / self.registrosPorPagina);
            if (self.paginaActual < totalPaginas) {
                self.paginaActual++;
                self.renderizarTabla();
            }
        });
    },

    cargarCombos: async function() {
        await this.cargarSedes();
        await this.cargarTipos();
        await this.cargarPeriodicidades();
    },
    
    cargarSedes: async function() {
        const sedes = [
            { id: 1, descripcion: 'SEDE PRINCIPAL' },
            { id: 2, descripcion: 'SEDE SECUNDARIA' }
        ];
        
        const $select = $('#sedeRegistroPlanilla');
        $select.empty().append('<option value="">Seleccione una opción</option>');
        sedes.forEach(sede => {
            $select.append(`<option value="${sede.id}">${sede.descripcion}</option>`);
        });
    },
    
    cargarTipos: async function() {
        const tipos = [
            { id: 1, descripcion: 'MENSUAL' },
            { id: 2, descripcion: 'QUINCENAL' }
        ];
        
        const $select = $('#tipoRegistroPlanilla');
        $select.empty().append('<option value="">Seleccione una opción</option>');
        tipos.forEach(tipo => {
            $select.append(`<option value="${tipo.id}">${tipo.descripcion}</option>`);
        });
    },
    
    cargarPeriodicidades: async function() {
        const periodicidades = [
            { id: 1, descripcion: 'MENSUAL' },
            { id: 2, descripcion: 'QUINCENAL' },
            { id: 3, descripcion: 'SEMANAL' }
        ];
        
        const $select = $('#periodicidadRegistroPlanilla');
        $select.empty().append('<option value="">Seleccione una opción</option>');
        periodicidades.forEach(per => {
            $select.append(`<option value="${per.id}">${per.descripcion}</option>`);
        });
    },

    generarMostrar: function() {
        const sede = $('#sedeRegistroPlanilla').val();
        const tipo = $('#tipoRegistroPlanilla').val();
        const periodo = $('#periodoRegistroPlanilla').val();
        
        if (!sede || !tipo || !periodo) {
            showNotification('Complete todos los campos obligatorios', 'warning');
            return;
        }
        
        console.log('🔄 Generando/Mostrando planilla');
        
        // Datos de ejemplo
        this.trabajadores = [
            {
                tipoDoc: 'DNI',
                nroDoc: '12345678',
                nombreCompleto: 'JUAN PÉREZ GARCÍA',
                fechaIngreso: '01/01/2024',
                regimenLaboral: 'RÉGIMEN GENERAL',
                regimenPensionario: 'ONP',
                turno: 'MAÑANA',
                sueldo: 1500.00,
                ingresos: 1500.00,
                ingresosAfecto: 1500.00,
                descuentos: 195.00,
                gratMensual: 0.00,
                gratDias: 0.00,
                totalGrat: 0.00,
                bonifExtra: 0.00,
                netoPagar: 1305.00,
                aportaciones: 135.00
            }
        ];
        
        this.renderizarTabla();
        showNotification('Planilla generada exitosamente', 'success');
    },
    
    renderizarTabla: function() {
        const tbody = $('#tablaRegistroPlanilla tbody');
        tbody.empty();
        
        if (this.trabajadores.length === 0) {
            tbody.append(`
                <tr>
                    <td colspan="18" class="text-center text-muted">
                        No hay datos disponibles
                    </td>
                </tr>
            `);
            $('#infoRegistrosRegistroPlanilla').text('Mostrando 0 a 0 de 0 registros');
            return;
        }
        
        const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
        const fin = Math.min(inicio + this.registrosPorPagina, this.trabajadores.length);
        const trabajadoresPagina = this.trabajadores.slice(inicio, fin);
        
        trabajadoresPagina.forEach((t, index) => {
            const numeroGlobal = inicio + index + 1;
            tbody.append(`
                <tr>
                    <td class="text-center">${numeroGlobal}</td>
                    <td class="text-center">${t.tipoDoc}</td>
                    <td class="text-center">${t.nroDoc}</td>
                    <td>${t.nombreCompleto}</td>
                    <td class="text-center">${t.fechaIngreso}</td>
                    <td>${t.regimenLaboral}</td>
                    <td>${t.regimenPensionario}</td>
                    <td class="text-center">${t.turno}</td>
                    <td class="text-end">${t.sueldo.toFixed(2)}</td>
                    <td class="text-end">${t.ingresos.toFixed(2)}</td>
                    <td class="text-end">${t.ingresosAfecto.toFixed(2)}</td>
                    <td class="text-end">${t.descuentos.toFixed(2)}</td>
                    <td class="text-end">${t.gratMensual.toFixed(2)}</td>
                    <td class="text-end">${t.gratDias.toFixed(2)}</td>
                    <td class="text-end">${t.totalGrat.toFixed(2)}</td>
                    <td class="text-end">${t.bonifExtra.toFixed(2)}</td>
                    <td class="text-end">${t.netoPagar.toFixed(2)}</td>
                    <td class="text-end">${t.aportaciones.toFixed(2)}</td>
                </tr>
            `);
        });
        
        $('#infoRegistrosRegistroPlanilla').text(`Mostrando ${inicio + 1} a ${fin} de ${this.trabajadores.length} registros`);
    }
};

$(document).ready(function() {
    if ($('#tablaRegistroPlanilla').length > 0) {
        registroPlanilla.init();
    }
});

const observerRegistroPlanilla = new MutationObserver(function() {
    if ($('#tablaRegistroPlanilla').length > 0) {
        observerRegistroPlanilla.disconnect();
        registroPlanilla.init();
    }
});

if (document.querySelector('main')) {
    observerRegistroPlanilla.observe(document.querySelector('main'), {
        childList: true,
        subtree: true
    });
}
