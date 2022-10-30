// VOBO

var text2 = document.createElement('h2');
text2.style.position = 'absolute';
text2.style.width = 200;
text2.style.height = 200;
text2.innerHTML = "Score:";
text2.style.top = 70 + 'px';
text2.style.left = 100 + 'px';
text2.id = "puntaje_id";
document.body.appendChild(text2);

var text2 = document.createElement('h2');
text2.style.position = 'absolute';
text2.style.width = 200;
text2.style.height = 200;
text2.innerHTML = "Time:";
text2.style.top = 120 + 'px';
text2.style.left = 100 + 'px';
text2.id = "puntaje_id";
document.body.appendChild(text2);

var pausa = document.createElement('button');
pausa.style.position = 'absolute';
pausa.style = "--clr:#8A7DFD"
pausa.style.width = 100;
pausa.style.height = 100;
pausa.id = "btn-pausa";
pausa.onclick = pausamodal;
pausa.innerHTML = "<i id='pmove'></i><i class='bx bx-menu'></i>";
document.body.appendChild(pausa);

function pausamodal() {
   location.href = "/pause";
}

document.addEventListener('keydown', e => {

   if (e.keyCode === 27) {
      pausamodal();
   }

})