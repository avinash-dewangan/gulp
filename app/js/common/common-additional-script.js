
// additional tooltip and datascroll script
$(window).load(function() {
    $(".dataTables_scrollBody").niceScroll({
        touchbehavior : true
    }); // First scrollable DIV
});
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
    $("form :input").attr("autocomplete", "off");

});