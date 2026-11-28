
// Los tres pasos del plan (HU-001) con su tiempo en minutos (HU-025)
var pasos = [
    { nombre: "Tarjetas y billeteras", minutos: 2, estado: "pendiente" },
    { nombre: "Línea móvil", minutos: 3, estado: "pendiente" },
    { nombre: "Denuncia policial", minutos: 4, estado: "pendiente" }
];

// Entidades financieras con su canal oficial (HU-013)
// Verificar los números en la web oficial de cada entidad antes de publicar.
var entidades = [
    { nombre: "BCP", visible: "01 311 9898", telefono: "013119898", estado: "pendiente", hora: "" },
    { nombre: "Interbank", visible: "01 311 9000", telefono: "013119000", estado: "pendiente", hora: "" },
    { nombre: "Yape", visible: "01 939 339 299", telefono: "019393399299", estado: "pendiente", hora: "" }
];

// Operadores móviles (HU-012). Verificar los números antes de publicar.
var operadores = {
    claro: { nombre: "Claro", visible: "0800 00123", telefono: "080000123" },
    movistar: { nombre: "Movistar", visible: "104", telefono: "104" },
    entel: { nombre: "Entel", visible: "123", telefono: "123" },
    bitel: { nombre: "Bitel", visible: "123", telefono: "123" }
};

var lineaBloqueada = false;
var horaLinea = "";
var horaDenuncia = "";
// Tiempo total estimado del recorrido, como en la landing y el prototipo (HU-025)
var minutosTotales = 8;



// PASO 2: funciones para mostrar pantallas
// Oculta todas las pantallas del plan y muestra solo una
function mostrarVista(id) {
    $(".vista").addClass("oculto");
    $("#" + id).removeClass("oculto");
}

// Diálogo de salida (HU-023)
function abrirSalir() {
    $("#modal-salir").removeClass("oculto");
}

function cerrarSalir() {
    $("#modal-salir").addClass("oculto");
}


// PASO 3: abrir y cerrar pasos del plan (HU-001)

// Abre un paso y lo marca "En curso" si aún no está hecho
function abrirPaso(numero) {
    if (pasos[numero - 1].estado !== "hecho") {
        pasos[numero - 1].estado = "en-curso";
    }
    actualizarPanel();
    mostrarVista("vista-paso" + numero);
}

// Cuenta las entidades que siguen pendientes
function contarPendientes() {
    var total = 0;
    for (var i = 0; i < entidades.length; i++) {
        if (entidades[i].estado === "pendiente") {
            total = total + 1;
        }
    }
    return total;
}

// Cierra un paso. El paso 1 solo queda "hecho" si no hay entidades
// pendientes y el paso 2 solo si se bloqueó la línea.
function terminarPaso(numero) {
    if (numero === 1 && contarPendientes() > 0) {
        pasos[0].estado = "pendiente";
    } else if (numero === 2 && lineaBloqueada === false) {
        pasos[1].estado = "pendiente";
    } else {
        pasos[numero - 1].estado = "hecho";
    }

    if (numero === 3) {
        horaDenuncia = new Date().toLocaleString();
    }

    actualizarPanel();

    if (numero < 3) {
        abrirPaso(numero + 1);
    } else {
        verConstancias();
    }
}

// Actualiza la barra de progreso, los estados y el tiempo restante
function actualizarPanel() {
    var hechos = 0;
    var textos = { "pendiente": "Pendiente", "en-curso": "En curso", "hecho": "Hecho" };

    for (var i = 0; i < pasos.length; i++) {
        var etiqueta = $("#estado-paso-" + (i + 1));
        etiqueta.text(textos[pasos[i].estado]);
        etiqueta.removeClass("pendiente");
        etiqueta.removeClass("en-curso");
        etiqueta.removeClass("hecho");
        etiqueta.addClass(pasos[i].estado);

        if (pasos[i].estado === "hecho") {
            hechos = hechos + 1;
        }
    }

    $("#texto-progreso").text(hechos + " de 3 pasos completados");
    $("#barra-progreso").css("width", (hechos * 100 / 3) + "%");
    // Cada paso cerrado descuenta 2 minutos: ~8, ~6, ~4 y ~2 (como en Figma)
    $("#tiempo").text("~" + (minutosTotales - hechos * 2) + " min restantes");
}

// PASO 4: entidades financieras 

function pintarEntidades() {
    var resueltas = 0;
    var botonRojoUsado = false;
    $("#lista-entidades").empty();

    for (var i = 0; i < entidades.length; i++) {
        var e = entidades[i];
        var item = $("<li>").addClass("entidad");

        item.append($("<strong>").text(e.nombre));
        item.append($("<span>").addClass("nota").text("Canal oficial · " + e.visible));

        var estado = $("<span>").addClass("estado");
        var botones = $("<div>").addClass("acciones");

        if (e.estado === "pendiente") {
            estado.addClass("pendiente").text("Pendiente");
            // El enlace tel: abre el marcador sin guardar contactos (HU-027).
            // Solo la primera entidad pendiente lleva el botón rojo:
            // una sola acción crítica por pantalla (guía de estilos 4.1.4).
            var llamar = $("<a>").attr("href", "tel:" + e.telefono).text("Llamar");
            if (botonRojoUsado === false) {
                llamar.addClass("rojoB");
                botonRojoUsado = true;
            } else {
                llamar.addClass("btn-borde");
            }
            botones.append(llamar);
            botones.append($("<button>").addClass("btn-borde").attr("type", "button")
                .attr("onclick", "marcarEntidad(" + i + ", 'bloqueada')").text("Ya bloqueé"));
            botones.append($("<button>").addClass("btn-borde").attr("type", "button")
                .attr("onclick", "marcarEntidad(" + i + ", 'no-aplica')").text("No aplica"));
        } else {
            resueltas = resueltas + 1;
            if (e.estado === "bloqueada") {
                estado.addClass("hecho").text("Bloqueada");
            } else {
                estado.addClass("gris").text("No aplica");
            }
            botones.append($("<button>").addClass("btn-texto").attr("type", "button")
                .attr("onclick", "marcarEntidad(" + i + ", 'pendiente')").text("Cambiar estado"));
        }

        item.append(estado);
        item.append(botones);
        $("#lista-entidades").append(item);
    }

    $("#contador-entidades").text(resueltas + " de " + entidades.length + " entidades resueltas");
}

function marcarEntidad(indice, estado) {
    entidades[indice].estado = estado;
    if (estado === "bloqueada") {
        entidades[indice].hora = new Date().toLocaleString();
    } else {
        entidades[indice].hora = "";
    }
    pintarEntidades();
}

// PASO 5: línea móvil 

function marcarLinea() {
    lineaBloqueada = !lineaBloqueada;

    if (lineaBloqueada) {
        horaLinea = new Date().toLocaleString();
        $("#boton-linea").text("Deshacer: aún no la bloqueo");
        $("#linea-ok").removeClass("oculto");
        $("#canal-operador").addClass("canal-hecho");
        $("#boton-fin-paso2").text("Línea protegida, continuar");
    } else {
        horaLinea = "";
        $("#boton-linea").text("Ya bloqueé mi línea");
        $("#linea-ok").addClass("oculto");
        $("#canal-operador").removeClass("canal-hecho");
        $("#boton-fin-paso2").text("Continuar por ahora");
    }
}


// PASO 6: constancias (HU-016, HU-039)
// Se vuelve a dibujar la lista completa cada vez: así no hay duplicados.


function agregarConstancia(titulo, detalle, pendiente) {
    var item = $("<li>").addClass("constancia");
    if (pendiente) {
        item.addClass("constancia-pendiente");
    }
    item.append($("<strong>").text(titulo));
    item.append($("<span>").addClass("nota").text(detalle));
    $("#lista-constancias").append(item);
}

function verConstancias() {
    var hayPendientes = false;
    var codigoBancos = $("#codigo-bancos").val();
    var codigoLinea = $("#codigo-linea").val();
    var numeroDenuncia = $("#numero-denuncia").val();

    $("#lista-constancias").empty();

    // Entidades financieras
    for (var i = 0; i < entidades.length; i++) {
        if (entidades[i].estado === "bloqueada") {
            var texto = entidades[i].hora;
            if (codigoBancos !== "") {
                texto = texto + " · Reporte: " + codigoBancos;
            }
            agregarConstancia("Bloqueo registrado · " + entidades[i].nombre, texto, false);
        } else if (entidades[i].estado === "pendiente") {
            agregarConstancia("Pendiente · " + entidades[i].nombre, "Aún no marcaste el bloqueo", true);
            hayPendientes = true;
        }
    }

    // Línea móvil
    var operador = operadores[$("#operador").val()].nombre;
    if (lineaBloqueada) {
        var textoLinea = horaLinea;
        if (codigoLinea !== "") {
            textoLinea = textoLinea + " · Reporte: " + codigoLinea;
        }
        agregarConstancia("Bloqueo de línea · " + operador, textoLinea, false);
    } else {
        agregarConstancia("Pendiente · Bloqueo de línea " + operador, "Aún no marcaste el bloqueo", true);
        hayPendientes = true;
    }

    // Denuncia
    if (pasos[2].estado === "hecho") {
        var textoDenuncia = horaDenuncia;
        if (numeroDenuncia !== "") {
            textoDenuncia = textoDenuncia + " · N.° " + numeroDenuncia;
        } else {
            textoDenuncia = textoDenuncia + " · Sin número registrado";
        }
        agregarConstancia("Denuncia registrada", textoDenuncia, false);
    } else {
        agregarConstancia("Pendiente · Denuncia policial", "Aún no finalizaste el paso 3", true);
        hayPendientes = true;
    }

    if (hayPendientes) {
        $("#aviso-pendientes").removeClass("oculto");
    } else {
        $("#aviso-pendientes").addClass("oculto");
    }

    mostrarVista("vista-constancias");
}


// PASO 7: borrar todo al terminar (HU-023)

function borrarTodo() {
    // Vacía los campos de texto y desmarca las casillas
    $("input[type='text']").val("");
    $("input[type='tel']").val("");
    $("input[type='email']").val("");
    $("input[type='number']").val("");
    $("input[type='date']").val("");
    $("textarea").val("");
    $("input[type='checkbox']").prop("checked", false);

    // Vacía las listas y las variables
    $("#lista-constancias").empty();
    lineaBloqueada = false;
    for (var i = 0; i < pasos.length; i++) {
        pasos[i].estado = "pendiente";
    }
    for (var k = 0; k < entidades.length; k++) {
        entidades[k].estado = "pendiente";
        entidades[k].hora = "";
    }

    // Muestra la pantalla final
    $("#modal-salir").addClass("oculto");
    $("#flujo").addClass("oculto");
    $(".barra-prestado").addClass("oculto");
    $("#tiempo").addClass("oculto");
    $("#vista-final").removeClass("oculto");
}


// PASO 8: eventos (cuando el árbol DOM está cargado)


$(function() {

    pintarEntidades();
    actualizarPanel();

    // Opción elegida en emergencia.html: llega como #robo o #perdida (HU-010)
    if (window.location.hash === "#perdida") {
        $("#bloque-perdida").removeClass("oculto");
    }

    // Fecha y hora actual como valor inicial del paso 3 
    $("#den-fecha").val(new Date().toLocaleString());

    // Cambio de operador: actualiza nombre, número y enlace (HU-012)
    $("#operador").change(function() {
        var op = operadores[$("#operador").val()];
        $("#nombre-operador").text(op.nombre);
        $("#numero-operador").text(op.visible);
        $("#llamar-operador").attr("href", "tel:" + op.telefono);
    });

    // Añadir una entidad nueva (HU-013)
    $("#form-entidad").submit(function(event) {
        event.preventDefault();
        var nombre = $("#nueva-nombre").val();
        var telefono = $("#nueva-telefono").val();

        if (nombre === "" || telefono === "") {
            $("#error-entidad").removeClass("oculto");
            return;
        }

        $("#error-entidad").addClass("oculto");
        entidades.push({ nombre: nombre, visible: telefono, telefono: telefono, estado: "pendiente", hora: "" });
        $("#nueva-nombre").val("");
        $("#nueva-telefono").val("");
        pintarEntidades();
    });

    // El formulario de la denuncia no se envía: solo reúne los datos
    $("#form-denuncia").submit(function(event) {
        event.preventDefault();
    });

    // Envío de constancias al correo 
    //validación HTML5
    $("#form-correo").submit(function(event) {
        event.preventDefault();
        $("#ok-correo").removeClass("oculto");
    });
});
