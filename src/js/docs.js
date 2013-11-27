$(function() {
    // Code for docs demos
    function createColorpickers() {
        $('#cp1').colorpicker({
            format: 'hex'
        });
        $('#cp2').colorpicker();
        $('#cp3').colorpicker();

        // Api demo
        var bodyStyle = $('body')[0].style;
        $('#cp4').colorpicker().on('changeColor', function(ev) {
            bodyStyle.backgroundColor = ev.color.toHex();
        });

        // Horizontal mode
        $('#cp5').colorpicker({
            format: 'rgba',
            horizontal: true
        });

        // Inline mode
        $('#cp6').colorpicker({
            container: $('#cp6')
        });

        // Disabled
        $('#cp7').colorpicker({
            disabled: true
        });

        // Swatch
        $('#cp8').colorpicker({
            swatch: ['#ff3e62', '#ffaf1f', '#fbd415', '#ffff00', '#00ff00', '#abff07', '#0000ff', '#3699ff', '#ff00ff', '#cdabd6', '#efefef', '#434343']
        });

        // Disabled / enabled triggers
        $(".disable-button").click(function(e) {
            e.preventDefault();
            $("#cp7").colorpicker('disable');
        });

        $(".enable-button").click(function(e) {
            e.preventDefault();
            $("#cp7").colorpicker('enable');
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
