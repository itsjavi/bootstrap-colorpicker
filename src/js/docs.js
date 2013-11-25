$(function() {
    // Code for docs demos
    function createColorpickers() {
        // Api demo
        var bodyStyle = $('body')[0].style;
        $('#bscp_apidemo').colorpicker({
            color: bodyStyle.backgroundColor
        }).on('changeColor', function(ev) {
            bodyStyle.backgroundColor = ev.color.toHex();
        });

        // Horizontal mode
        $('#bscp_forceformat').colorpicker({
            format: 'rgba', // force this format
            horizontal: true
        });

        $('.bscp-auto').colorpicker();

        // Disabled / enabled triggers
        $(".disable-button").click(function(e) {
            e.preventDefault();
            $("#bscp_endis").colorpicker('disable');
        });

        $(".enable-button").click(function(e) {
            e.preventDefault();
            $("#bscp_endis").colorpicker('enable');
        });
    }

    createColorpickers();

    // Create / destroy instances
    $('.bscp-destroy').click(function(e) {
        e.preventDefault();
        $('.bscp').colorpicker('destroy');
        $(".disable-button, .enable-button").off('click');
    });

    $('.bscp-create').click(function(e) {
        e.preventDefault();
        createColorpickers();
    });
});
