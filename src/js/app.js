import Card from "./Card";
import State from "./state";

const state = new State();
state.save();
const container = document.querySelector('.container')
container.addEventListener('click', (e) => {
   // console.log(e.target.parentElement)
    if (e.target.classList.contains('add-button')) {
        //console.log(e.target)
        const card = new Card(e.target.parentElement, state);
        card.createCard();
        card.dragging();
    }
})
