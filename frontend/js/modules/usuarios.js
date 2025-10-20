// Configuración y funcionalidad para el módulo de Usuarios
let tablaUsuarios;
let contenidoOriginal = '';

document.addEventListener('DOMContentLoaded', function() {
    // Guardar el contenido original
    contenidoOriginal = document.querySelector('main').innerHTML;
    
    init();
    configurarBotones();
});

// Inicialización de la tabla con DataTables
function init() {
    tablaUsuarios = $("#tabla-usuarios").DataTable({
        "bSort": false,
        "sDom": 'rt<"row align-items-center mt-2"<"col-sm-auto"l><"col-sm-auto"i><"col text-right"p>>',
        "paging": true,
        "info": true,
        "searching": true,
        "autoWidth": false,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        },
        "aoColumns": [
            { sClass: "text-center" }, // ID
            { sClass: "text-center" }, // Tipo Doc
            { sClass: "text-center" }, // Nro Doc
            { sClass: "text-left" },   // Apellidos y Nombres
            { sClass: "text-left" },   // Sede
            { sClass: "text-left" },   // Rol
            { sClass: "text-left" },   // Usuario
            { sClass: "text-center" }, // Estado
            { sClass: "text-center" }  // Acciones (engranaje)
        ],
        "initComplete": function() {
            // Agregar filtros en el pie de tabla
            this.api().columns().every(function(index) {
                // No agregar filtro a la última columna (acciones)
                if (index < 8) {
                    var column = this;
                    var input = $('<input type="text" class="form-control form-control-sm" placeholder="Filtrar...">')
                        .appendTo($(column.footer()).empty())
                        .on('keyup change', function() {
                            if (column.search() !== this.value) {
                                column.search(this.value).draw();
                            }
                        });
                }
            });
        }
    });

    // Cargar datos de usuarios
    cargarDatosUsuarios();
}

// Configuración de botones
function configurarBotones() {
    // Botón Nuevo Usuario
    const btnNuevo = document.querySelector('.btn-nuevo-usuario');
    if (btnNuevo) {
        btnNuevo.addEventListener('click', function() {
            abrirFormularioRegistro();
        });
    }

    // Botón Actualizar
    const btnActualizar = document.querySelector('.btn-actualizar-motivo');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', function() {
            cargarDatosUsuarios();
        });
    }
}

// Función para abrir el formulario de registro
function abrirFormularioRegistro(idUsuario = null) {
    const mainContent = document.querySelector('main');
    
    // Guardar el contenido actual
    const contenidoActual = mainContent.innerHTML;
    
    // Mostrar indicador de carga
    mainContent.innerHTML = `
        <div class="row">
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3">Cargando formulario de registro...</p>
            </div>
        </div>
    `;
    
    // IMPORTANTE: Prueba estas rutas en orden hasta que funcione una
    const rutasPosibles = [
        'registro-usuario.html',           // Misma carpeta
        './registro-usuario.html',         // Misma carpeta (explícito)
        '../modules/registro-usuario.html', // Carpeta padre + modules
        '/modules/registro-usuario.html'    // Ruta absoluta desde raíz
    ];
    
    let rutaIndex = 0;
    
    function intentarCargar() {
        if (rutaIndex >= rutasPosibles.length) {
            // Si ninguna ruta funcionó, mostrar error
            mostrarError(mainContent, contenidoActual);
            return;
        }
        
        const ruta = rutasPosibles[rutaIndex];
        console.log(`Intentando cargar desde: ${ruta}`);
        
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Éxito - cargar el contenido
                    console.log(`✓ Archivo cargado correctamente desde: ${ruta}`);
                    mainContent.innerHTML = xhr.responseText;
                    
                    // Agregar botón para volver
                    agregarBotonVolver(mainContent, contenidoActual);
                    
                    // Inicializar el formulario
                    inicializarFormulario(idUsuario);
                } else {
                    // Error - intentar siguiente ruta
                    console.log(`✗ Error ${xhr.status} al cargar desde: ${ruta}`);
                    rutaIndex++;
                    intentarCargar();
                }
            }
        };
        
        xhr.open('GET', ruta, true);
        xhr.send();
    }
    
    // Iniciar el intento de carga
    intentarCargar();
}

// Función auxiliar para agregar botón volver
function agregarBotonVolver(mainContent, contenidoActual) {
    const header = mainContent.querySelector('.d-flex.justify-content-between');
    if (header) {
        const btnVolver = document.createElement('button');
        btnVolver.className = 'btn btn-secondary ms-2';
        btnVolver.innerHTML = '<i class="fas fa-arrow-left me-1"></i> Volver';
        btnVolver.addEventListener('click', function() {
            mainContent.innerHTML = contenidoActual;
            // Reinicializar los eventos
            init();
            configurarBotones();
        });
        
        const toolbar = header.querySelector('.btn-toolbar');
        if (toolbar) {
            toolbar.prepend(btnVolver);
        }
    }
}

// Función auxiliar para mostrar error
function mostrarError(mainContent, contenidoActual) {
    console.error('No se pudo cargar el formulario desde ninguna ruta');
    mainContent.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <h4 class="alert-heading">Error al cargar el formulario</h4>
            <p>No se pudo encontrar el archivo <strong>registro-usuario.html</strong></p>
            <hr>
            <p class="mb-0">Por favor, verifica que el archivo existe en la ruta correcta:</p>
            <ul class="mt-2">
                <li><code>modules/registro-usuario.html</code></li>
            </ul>
            <button class="btn btn-primary mt-3" id="btnVolverError">
                <i class="fas fa-arrow-left me-1"></i> Volver a la lista
            </button>
        </div>
    `;
    
    document.getElementById('btnVolverError').addEventListener('click', function() {
        mainContent.innerHTML = contenidoActual;
        init();
        configurarBotones();
    });
}

// Inicializar el formulario de registro
function inicializarFormulario(idUsuario = null) {
    console.log('Formulario de registro inicializado');
    
    if (idUsuario) {
        console.log('Cargando datos del usuario ID:', idUsuario);
        // Aquí se cargarían los datos del usuario desde el backend
    }
    
    // Configurar el botón Siguiente
    const btnSiguiente = document.querySelector('.btn-siguiente');
    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Guardando usuario...');
            
            // Simulación de guardado exitoso
            setTimeout(() => {
                alert('Usuario guardado correctamente');
                document.querySelector('main').innerHTML = contenidoOriginal;
                init();
                configurarBotones();
            }, 1000);
        });
    }
    
    // Configurar el botón Cancelar
    const btnCancelar = document.querySelector('.btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('main').innerHTML = contenidoOriginal;
            init();
            configurarBotones();
        });
    }
}

// Función para cargar datos de usuarios
function cargarDatosUsuarios() {
    // Limpiar tabla
    tablaUsuarios.clear().draw();
    
    // Mostrar indicador de carga
    const tbody = document.querySelector('#tabla-usuarios tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="9" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2">Cargando datos...</p>
            </td>
        </tr>
    `;
    
    // Simulación de datos
    setTimeout(() => {
        const datos = [
            {
                id: 1,
                tipoDoc: 'DNI',
                nroDoc: '12345678',
                nombre: 'García Pérez, Juan',
                sede: 'Lima',
                rol: 'Administrador',
                usuario: 'jgarcia',
                estado: 'Activo'
            },
            {
                id: 2,
                tipoDoc: 'DNI',
                nroDoc: '87654321',
                nombre: 'Rodríguez López, María',
                sede: 'Arequipa',
                rol: 'Usuario',
                usuario: 'mrodriguez',
                estado: 'Activo'
            },
            {
                id: 3,
                tipoDoc: 'CE',
                nroDoc: 'CE123456',
                nombre: 'Smith Johnson, John',
                sede: 'Trujillo',
                rol: 'Usuario',
                usuario: 'jsmith',
                estado: 'Inactivo'
            }
        ];
        
        tablaUsuarios.clear();
        
        datos.forEach(usuario => {
            tablaUsuarios.row.add([
                usuario.id,
                usuario.tipoDoc,
                usuario.nroDoc,
                usuario.nombre,
                usuario.sede,
                usuario.rol,
                usuario.usuario,
                `<span class="badge ${usuario.estado === 'Activo' ? 'bg-success' : 'bg-danger'}">${usuario.estado}</span>`,
                `<div class="btn-group">
                    <button type="button" class="btn btn-sm btn-outline-primary btn-editar" data-id="${usuario.id}" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${usuario.id}" title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>`
            ]).draw(false);
        });
        
        configurarBotonesAcciones();
    }, 1000);
}

// Configurar botones de acciones (editar, eliminar)
function configurarBotonesAcciones() {
    // Botones Editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            console.log('Editar usuario ID:', id);
            abrirFormularioRegistro(id);
        });
    });
    
    // Botones Eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            console.log('Eliminar usuario ID:', id);
            
            if (confirm('¿Está seguro de eliminar este usuario?')) {
                console.log('Usuario eliminado');
                cargarDatosUsuarios();
            }
        });
    });
}