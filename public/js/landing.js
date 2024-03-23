const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', function() {
        this.querySelector('.dropdown-menu').classList.toggle('show');
    });
});

window.addEventListener('click', function(event) {
    if (!event.target.matches('.dropdown-toggle')) {
        dropdowns.forEach(dropdown => {
            if (dropdown.querySelector('.dropdown-menu').classList.contains('show')) {
                dropdown.querySelector('.dropdown-menu').classList.remove('show');
            }
        });
    }
});