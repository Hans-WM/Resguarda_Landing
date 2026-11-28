
// El código se ejecuta cuando el árbol DOM está cargado
$(function() {

    // Menú de hamburguesa: al hacer click se agrega o quita
    // la clase "abierto" y el CSS muestra u oculta el menú.
    $("#boton-menu").click(function() {
        $("#navegacion").toggleClass("abierto");

        if ($("#navegacion").is(".abierto")) {
            $("#boton-menu").attr("aria-expanded", "true");
        } else {
            $("#boton-menu").attr("aria-expanded", "false");
        }
    });

    // Al elegir una opción del menú, el menú se cierra
    $("#navegacion a").click(function() {
        $("#navegacion").removeClass("abierto");
        $("#boton-menu").attr("aria-expanded", "false");
    });
});
