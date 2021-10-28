const burgerMenu = document.querySelector('.burger-menu');
const formMain = document.querySelector('.form-main');
const body = document.body;
if (burgerMenu) {
  burgerMenu.addEventListener('click', function (e) {
    burgerMenu.classList.toggle('active');
    formMain.classList.toggle('active');
  });
}
