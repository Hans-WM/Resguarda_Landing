var radios = document.querySelectorAll('input[name="situacion"]');
var opciones = document.querySelectorAll(".opcion");

// Marca visualmente la tarjeta elegida
function marcar() {
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            opciones[i].classList.add("seleccionada");
        } else {
            opciones[i].classList.remove("seleccionada");
        }
    }
}

for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", marcar);
}
marcar();


document.getElementById("form-emergencia").addEventListener("submit", function (e) {
    e.preventDefault();
    planificacion();
});