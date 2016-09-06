var Swing = require('swing');

console.log('Starting js');
// Prepare the cards in the stack for iteration
// const cards = [].slice.call(document.querySelectorAll('.stack li'));
//
// console.log(cards);
// An instance of the Stack is used to attach event listeners.
var stack = Swing.Stack();
console.log('Here');
console.log(stack);
[].forEach.call(document.querySelectorAll('.stack li'), function (targetElement) {
    stack.createCard(targetElement);

    targetElement.classList.add('in-deck');
});

stack.on('throwout', function (e) {
    console.log(e.target.innerText || e.target.textContent, 'has been thrown out of the stack to the', e.throwDirection == 1 ? 'right' : 'left', 'direction.');

    e.target.classList.remove('in-deck');
});

stack.on('throwin', function (e) {
    console.log(e.target.innerText || e.target.textContent, 'has been thrown into the stack from the', e.throwDirection == 1 ? 'right' : 'left', 'direction.');

    e.target.classList.add('in-deck');
});
