export default class Card {
  constructor(elem) {
    this.elem = elem;
    // this.column = elem.querySelector('.add-button');
    this.container = document.querySelector('.container');
    this.cardList = JSON.parse(window.localStorage.getItem('cardList')) || { todo: [], progress: [], done: [] };
    // this.count = 0;
  }

  draw() {
    this.cardList.todo.forEach((elem) => {
      this.drawCard(elem.value, document.querySelector('.todo'), elem.id);
    });
    this.cardList.progress.forEach((el) => {
      this.drawCard(el.value, document.querySelector('.progress'), el.id);
    });
    this.cardList.done.forEach((e) => {
      this.drawCard(e.value, document.querySelector('.done'), e.id);
    });
    this.updateState();
  }

  drawCard(value, col, id) {
    this.card = document.createElement('div');
    const close = document.createElement('button');
    if (value) {
      this.card.classList.add('card');
      this.card.textContent = value;
      close.classList.add('close-button');
      this.card.id = id;
      col.insertBefore(this.card, col.querySelector('.add-button'));
      this.card.addEventListener('mouseenter', (ev) => {
        ev.preventDefault();
        if (ev.target.classList.contains('card')) {
          ev.target.appendChild(close);
          close.classList.add('close');
        }
      });
      this.card.addEventListener('click', (closeBut) => {
        if (closeBut.target.classList.contains('close-button')) {
          const removeEl = closeBut.target.parentElement;
          this.cardList[`${removeEl.parentElement.classList[1]}`].forEach((el) => {
            if (el.id === `${removeEl.id}`) {
              this.cardList[`${removeEl.parentElement.classList[1]}`].splice(this.cardList[`${removeEl.parentElement.classList[1]}`].indexOf(el), 1);
            }
          });
          this.updateState();
          removeEl.remove();
        }
      });
      this.card.addEventListener('mouseleave', (e1) => {
        e1.target.querySelector('.close').remove();
      });
    }
  }

  createCard() {
    this.container.addEventListener('click', (e) => {
      if (e.target.parentElement.querySelector('.button-add')) {
        return;
      }
      if (e.target.classList.contains('add-button')) {
        const input = document.createElement('input');
        const buttonAdd = document.createElement('button');
        buttonAdd.classList.add('button-add');
        buttonAdd.textContent = 'Add';
        e.target.parentElement.appendChild(input);
        e.target.parentElement.appendChild(buttonAdd);
        buttonAdd.addEventListener('click', (el) => {
          el.preventDefault();
          const target = e.target.parentElement;
          const id = `${input.value} + ${Math.random()}`;
          this.cardList[buttonAdd.parentElement.classList[1]].push({ value: `${input.value}`, id: `${id}` });
          this.updateState();
          this.drawCard(input.value, target, id);
          input.remove();
          buttonAdd.remove();
        });
      }
    });
    this.updateState();
    // console.log(this.cardList)
  }

  dragging() {
    this.draggedEl = null;
    this.ghostEl = null;
    this.empteEl = document.createElement('div');
    const container = document.querySelector('.container');
    container.addEventListener('mousedown', (evt) => {
      // console.log(container);
      if (!evt.target.classList.contains('card')) {
        return;
      }
      evt.preventDefault();
      document.body.style.cursor = 'grabbing';
      this.draggedEl = evt.target;
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
      this.cardList[this.column.classList[1]].forEach((el) => {
        if (el.id === this.draggedEl.id) {
          this.cardList[this.column.classList[1]]
            .splice(this.cardList[this.column.classList[1]].indexOf(el), 1);
          this.updateState();
        }
      });
      this.column.removeChild(this.draggedEl);
    });

    document.addEventListener('mousemove', (evt) => {
      evt.preventDefault();// не даём выделять элементы
      if (!this.draggedEl) {
        this.empteEl.remove();
        return;
      }
      this.ghostEl.style.left = `${evt.clientX - this.left}px`;
      this.ghostEl.style.top = `${evt.clientY - this.top}px`;
      this.ghostEl.style.pointerEvents = 'none';
      this.posEl = document.elementFromPoint(evt.clientX, evt.clientY);
      if (this.posEl) {
        if (this.posEl.classList.contains('card')) {
          this.middle = this.posEl.getBoundingClientRect().y + this.posEl.offsetHeight / 2;
          if (evt.pageY < this.middle) {
            this.posEl.parentElement.insertBefore(this.empteEl, this.posEl);
          } else {
            this.posEl.parentElement.insertBefore(this.empteEl, this.posEl.nextSibling);
          }
        } else if (this.posEl.classList.contains('column')) {
          this.posEl.insertBefore(this.empteEl, this.posEl.lastElementChild);
        }
      }
    });
    document.addEventListener('mouseup', (event) => {
      if (!this.draggedEl) {
        return;
      }
      event.preventDefault();
      if (this.empteEl) {
        const closest = this.empteEl.closest('.column');
        let index = 0;
        const add = { value: `${this.draggedEl.textContent}`, id: `${this.draggedEl.id}` };
        this.cardList[closest.classList[1]].forEach((el) => {
          if (this.draggedEl.previousSibling) {
            if (el.id === this.draggedEl.previousSibling.id) {
              index = this.cardList[closest.classList[1]].indexOf(el);
            }
          }
        });
        this.cardList[closest.classList[1]].splice(index + 1, 0, add);
        this.updateState();
        this.empteEl.replaceWith(this.draggedEl);
        this.draggedEl = null;
        this.empteEl.remove();
        document.body.style.cursor = 'pointer';
        document.body.removeChild(this.ghostEl);
      }
    });
  }

  updateState() {
    window.localStorage.setItem('cardList', JSON.stringify(this.cardList));
  }
}
