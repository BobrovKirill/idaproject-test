document.addEventListener('DOMContentLoaded', function (e) {
  document.querySelector('.body').classList.add('waiting');
  document.addEventListener('click', deleteCard);
  const mainForm = document.querySelector('.form-main__body');
  mainForm.addEventListener('submit', createCard);

  renderCards();

  // VALIDATE BUTTON FORM
  const requiredList = document.querySelectorAll('.req');
  requiredList.forEach((el) => {
    el.addEventListener('input', ({ target }) => {
      const input = target;
      if (input.getAttribute('name') === 'price') {
        chectPrice(input);
        chectButtonForm();
      } else if (input.getAttribute('name') === 'url') {
        chectUrl(input);
      } else if (input.value.length > 0) {
        input.classList.add('done');
        chectButtonForm();
      } else {
        input.classList.remove('done');
				chectButtonForm();
      }
    });
  });

  function chectButtonForm() {
    if (document.querySelectorAll('.done').length === 3) {
      document.querySelector('.form-main__btn').classList.add('active');
    } else {
      document.querySelector('.form-main__btn').classList.remove('active');
    }
  }

  function chectPrice(input) {
    if (isANumber(input.value)) {
      input.value = formatPrice(input.value);
      input.classList.add('done');
    } else {
      input.value = null;
      input.classList.remove('done');
    }
  }

  function isANumber(str) {
    return /\d\s|\d/.test(str);
  }

  function formatPrice(price) {
    return price.replace(/\s/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function chectUrl(url) {
    console.log(url.checkValidity() && url.value.length > 1);
    if (url.checkValidity() && url.value.length > 1) {
      url.classList.add('done');
      chectButtonForm();
    } else {
      url.classList.remove('done');
      chectButtonForm();
    }
  }

  //DELETE CARD

  function deleteCard(e) {
    const target = e.target;

    if (target.closest('.products-main__card')) {
      e.preventDefault();
      const cardId = target.closest('.products-main__card').dataset.id;
      target.closest('.products-main__card').classList.add('del');
      const del = (cardId) =>
        document.querySelector(`[data-id ="${cardId}"]`).remove();
      setTimeout(del, 900, cardId);

      //deleteCardToJson(file, cardId) - не победил
    }
  }

  // CREATE NEW CARD

  function createCard(e) {
    e.preventDefault();

    let error = valideteInput(requiredList);
    if (!error) {
      document.querySelectorAll('.done').forEach((el) => {
        el.classList.remove('done');
      });

      const file = 'https://api.jsonbin.io/v3/b/617a607aaa02be1d445fed66/2';
      document.querySelector('.form-main__btn').classList.add('active');
      const productMain = document.querySelector('.products-main');
      const formData = new FormData(e.target);
      const obj = Object.fromEntries(formData);
      const addCssClass = 'add';
      const template = renderNewCard(obj, addCssClass);
      //addCardToJson(file, obj); - не победил
      productMain.insertAdjacentHTML('beforeend', template);
      const newCard = document.querySelector('.add');
      const add = (newCard) => newCard.classList.remove('add');
      setTimeout(add, 900, newCard);
      mainForm.reset();
      document.querySelector('.form-main__btn').classList.remove('active');
    }
  }

  // RENDER CARD

  function renderNewCard(obj, addCssClass) {
    const { name, about, url, price, id } = obj;

    return `
		<a data-id = ${id} href="#" class="products-main__card ${addCssClass} icon-trash">
		<div class="products-main__img">
			<span>Изображение не найдено</span>
			<img src=${url} alt="product images">
		</div>
		<div class="products-main__content">
			<h4 class="products-main__title">${name}</h4>
			<p class="products-main__text">${about}</p>
			<p class="products-main__price">${price} руб.</p>
		</div>
	</a>
		`;
  }

  // VALIDATE INPUT

  function valideteInput(requiredList) {
    requiredList.forEach((item) => {
      const input = item.querySelector('input');
      item.classList.remove('error');
      if (input.value === '') {
        item.classList.add('error');
      }
    });
    if (document.querySelectorAll('.error').length === 0) {
      return false;
    } else {
      return true;
    }
  }

  // GENERATE CARD LIST FROM JSON

  async function renderCards() {
    const file = 'https://api.jsonbin.io/v3/b/617a607aaa02be1d445fed66/2';
    const padsedJson = await parsedJson(file);
    const datas = padsedJson.record;
    const productMain = document.querySelector('.products-main');
    await datas.forEach((data) => {
      const template = renderNewCard(data);
      productMain.insertAdjacentHTML('beforeend', template);
    });
    document.querySelector('.body').classList.remove('waiting');
  }

  async function parsedJson(file) {
    try {
      const response = await fetch(file, {
        metod: 'GET',
        headers: {
          'X-Master-Key':
            '$2b$10$/9EpRlx96N8hzGQGl3XVdOP0tWoVL9YJk84HmDy0B8nVfQrKRBEMm',
        },
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  async function addCardToJson(file, data) {
    try {
      const response = await fetch(file, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json;charset=utf-8',
          mode: 'cors',
          'Access-Control-Allow-Origin': '*',
          'X-Master-Key':
            '$2b$10$/9EpRlx96N8hzGQGl3XVdOP0tWoVL9YJk84HmDy0B8nVfQrKRBEMm',
          credentials: 'include',
        },
      });
      console.log(response.json());
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteCardToJson(file, data) {
    try {
      const response = await fetch(file, {
        method: 'DELETE',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json',
        },
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }
});
;
const burgerMenu = document.querySelector('.burger-menu');
const formMain = document.querySelector('.form-main');
const body = document.body;
if (burgerMenu) {
  burgerMenu.addEventListener('click', function (e) {
    burgerMenu.classList.toggle('active');
    formMain.classList.toggle('active');
  });
}
;
