"use strict";
$(function() {
  $('.example-code-toggle').on('click', function(){
    $(this).parent().find('.example-code').toggle();
  });
});
