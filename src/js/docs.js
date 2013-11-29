$(function() {
    // Code for docs demos
    function createColorpickers() {
        // Api demo
        var bodyStyle = $('body')[0].style;
        $('#demo_apidemo').colorpicker({
            color: bodyStyle.backgroundColor
        }).on('changeColor', function(ev) {
            bodyStyle.backgroundColor = ev.color.toHex();
        });

        // Horizontal mode
        $('#demo_forceformat').colorpicker({
            format: 'rgba', // force this format
            horizontal: true
        });

        $('.demo-auto').colorpicker();

        // Disabled / enabled triggers
        $(".disable-button").click(function(e) {
            e.preventDefault();
            $("#demo_endis").colorpicker('disable');
        });

        $(".enable-button").click(function(e) {
            e.preventDefault();
            $("#demo_endis").colorpicker('enable');
        });
    }

    createColorpickers();

    // Create / destroy instances
    $('.demo-destroy').click(function(e) {
        e.preventDefault();
        $('.demo').colorpicker('destroy');
        $(".disable-button, .enable-button").off('click');
    });

    $('.demo-create').click(function(e) {
        e.preventDefault();
        createColorpickers();
    });
});
