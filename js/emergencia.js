
$(function() {

    // HU-020: al aceptar el aviso de privacidad se cierra la ventana
    $("#boton-continuar").click(function() {
        $("#modal-aviso").addClass("oculto");
    });

    // Marca visualmente la tarjeta elegida 
    function marcar() {
        $(".opcion").removeClass("seleccionada");
        if ($("input[name='situacion']:checked").val() === "robo") {
            $(".opcion").first().addClass("seleccionada");
        } else {
            $(".opcion").last().addClass("seleccionada");
        }
    }

    $("input[name='situacion']").change(function() {
        marcar();
    });
    marcar();

    // Ver mi plan: pasa al plan la opción elegida 
    $("#form-emergencia").submit(function(event) {
        event.preventDefault();
        var situacion = $("input[name='situacion']:checked").val();
        window.location.href = "plan.html#" + situacion;
    });
});
