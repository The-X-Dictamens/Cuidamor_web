$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
    });

    $('#dismiss').on('click', function () {
        $('#sidebar').removeClass('active');
    });
});
