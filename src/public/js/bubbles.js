// VOBO

function square() {
    let section = document.querySelector('.bubbles-circle');
    let square = document.createElement('span');
    let size = Math.random() * 50;

    square.style.width = 30 + size + 'px';
    square.style.height = 30 + size + 'px';

    square.style.top = Math.random() * innerHeight + 'px';
    square.style.left = Math.random() * innerWidth + 'px';
    section.appendChild(square);

    setTimeout(() => square.remove(), 5000);
}

setInterval(square, 150);