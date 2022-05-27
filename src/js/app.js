import Card from './Card';

const container = document.querySelector('.container');
const card = new Card(container);
card.draw();
card.createCard();
card.dragging();
