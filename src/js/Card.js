export default class Card {
  constructor(elem, state) {
    this.elem = elem;
    this.column = elem.querySelector('.add-button');
    this.container = document.querySelector('.container');
    this.cardList = {
      todo: [],
      progress: [],
      done: [],
    };
    this.state = state;
    this.count = 0;
    // this.updateState();
  }

  createCard() {
    const input = document.createElement('input');
    const buttonAdd = document.createElement('button');
    buttonAdd.classList.add('button-add');
    this.elem.appendChild(input);
    buttonAdd.textContent = 'Add';
    this.elem.appendChild(buttonAdd);
    const card = document.createElement('div');
    const close = document.createElement('button');

    buttonAdd.addEventListener('click', (e) => {
      e.preventDefault();
      if (input.value) {
        card.classList.add('card');
        card.textContent = input.value;
        close.classList.add('close');
        card.appendChild(close);
        this.elem.insertBefore(card, this.column);
        input.remove();
        buttonAdd.remove();
        const cards = this.cardList[`${card.parentElement.classList[1]}`];
        cards.push(card);
        this.cardList[`${card.parentElement.classList[1]}`] = cards;
        // console.log(this.cardList[`${card.parentElement.classList[1]}`])
        // console.log(this.cardList);
        this.count += 1;
        // console.log(this.count)
        this.updateState();
        // return this.cardList;
      }
    });
    card.addEventListener('mouseenter', (e) => {
      // console.log(e.target);
      if (e.target.classList.contains('card')) {
        const elem = e.target.querySelector('.close');
        elem.style.display = 'block';
        // console.log(e.target.querySelector('.close'))
      }
    });
    card.addEventListener('mouseout', (e) => {
      e.target.querySelector('.close').style.display = 'none';
    });
    this.updateState();
    // console.log(this.cardList)
  }

  dragging() {
    this.empteEl = document.createElement('div');
    const container = document.querySelector('.container');
    container.addEventListener('mousedown', (evt) => {
      // console.log(evt.target);
      if (!evt.target.classList.contains('card')) {
        return;
      }
      evt.preventDefault();
      document.body.style.cursor = 'grabbing';
      this.draggedEl = evt.target;
      // console.log(this.draggedEl.getBoundingClientRect());
      this.ghostEl = evt.target.cloneNode(true);
      this.ghostEl.classList.add('dragged');
      this.ghostEl.style.transform = 'rotate(5deg)';
      document.body.appendChild(this.ghostEl);
      this.left = evt.clientX - this.draggedEl.getBoundingClientRect().x;
      this.top = evt.clientY - this.draggedEl.getBoundingClientRect().y;
      this.coord = {
        x: this.draggedEl.getBoundingClientRect().x,
        y: this.draggedEl.getBoundingClientRect().y,
      };
      this.elemleft = evt.clientX - this.coord.x;
      this.elemtop = evt.clientY - this.coord.y;
      this.ghostEl.style.left = `${evt.clientX - this.left}px`;
      this.ghostEl.style.top = `${evt.clientY - this.top}px`;
      this.ghostEl.style.width = `${this.draggedEl.getBoundingClientRect().width}px`;
      this.ghostEl.style.height = `${this.draggedEl.getBoundingClientRect().height}px`;
      this.column = this.draggedEl.closest('.column');
      this.column.insertBefore(this.empteEl, this.draggedEl);
      this.empteEl.classList.add('empty');
      this.column.removeChild(this.draggedEl);
      // console.log(this.draggedEl.style.width);
    });

    document.body.addEventListener('mousemove', (evt) => {
      evt.preventDefault();// не даём выделять элементы
      if (!this.draggedEl) {
        return;
      }
      this.ghostEl.style.left = `${evt.clientX - this.left}px`;
      this.ghostEl.style.top = `${evt.clientY - this.top}px`;
      this.posEl = document.elementFromPoint(evt.clientX, evt.clientY);
      // console.log(this.posEl);
      if (this.posEl.classList.contains('.card')) {
        // this.middle = this.posEl.getBoundingClientRect().y + this.posEl.offsetHeight / 2;
        if (this.posEl) {
          this.posEl.parentElement.inserBefore(this.empteEl, this.posEl);
        } else {
          this.posEl.parentElement.insertBefore(this.empteEl, this.posEl.nextSibling);
        }
      }
    });
    document.body.addEventListener('mouseleave', () => { // при уходе курсора за границы контейнера - отменяем перенос
      if (!this.draggedEl) {
        return;
      }
      document.body.removeChild(this.ghostEl);
      this.ghostEl = null;
      this.draggedEl = null;
    });
    document.body.addEventListener('mouseup', (evt) => {
      if (!this.draggedEl) {
        return;
      }
      evt.preventDefault();
      document.body.removeChild(this.ghostEl);
      this.closest = document.elementFromPoint(evt.clientX, evt.clientY);
      // console.log(this.closest)
      this.parentEl = this.closest.parentElement;
      // console.log(this.parentEl)
      if (this.parentEl.classList.contains('column')) {
        this.parentEl.insertBefore(this.draggedEl, this.closest);
      }
    });
  }

  updateState() {
    window.localStorage.setItem('cardList', JSON.stringify(this.cardList));
    // console.log(window.localStorage)
  }
}
