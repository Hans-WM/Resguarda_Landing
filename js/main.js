function emergencia(){
    window.location.href = "pages/emergencia.html";
}
function volver(){
    window.location.href="../index.html";
}
function planificacion(){
    window.location.href="plan.html";
}
function info(){
    window.location.href="informacion.html";
}


var preguntas = document.querySelectorAll(".faq details");
for (var i = 0; i < preguntas.length; i++) {
    preguntas[i].addEventListener("toggle", function () {
        if (!this.open) { return; }
        for (var k = 0; k < preguntas.length; k++) {
            if (preguntas[k] !== this) { preguntas[k].open = false; }
        }
    });
}
var botonMenu = document.getElementById("boton-menu");
var navegacion = document.getElementById("navegacion");

function cerrarMenu() {
    navegacion.classList.remove("abierto");
    botonMenu.setAttribute("aria-expanded", "false");
}

if (botonMenu && navegacion) {
    botonMenu.addEventListener("click", function () {
        var abierto = navegacion.classList.toggle("abierto");
        botonMenu.setAttribute("aria-expanded", String(abierto));
    });

    // Al elegir un enlace, el menú se cierra
    var enlacesMenu = navegacion.querySelectorAll("a");
    for (var i = 0; i < enlacesMenu.length; i++) {
        enlacesMenu[i].addEventListener("click", cerrarMenu);
    }

    
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && navegacion.classList.contains("abierto")) {
            cerrarMenu();
            botonMenu.focus();
        }
    });
}