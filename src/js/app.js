import Card from './Card';

const container = document.querySelector('.container');
const card1 = new Card(container);
card1.draw();
card1.createCard();
card1.dragging();
