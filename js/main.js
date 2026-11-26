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

// Preguntas frecuentes: al abrir una, se cierran las demás
var preguntas = document.querySelectorAll(".faq details");
for (var i = 0; i < preguntas.length; i++) {
    preguntas[i].addEventListener("toggle", function () {
        if (!this.open) { return; }
        for (var k = 0; k < preguntas.length; k++) {
            if (preguntas[k] !== this) { preguntas[k].open = false; }
        }
    });
}
