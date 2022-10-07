
function regresar() {
	location.href="playgame.html";
}

$('#btn-brillo').click(function(){

});

const slideValue=document.querySelector(".span_volume");
const inputSlider=document.querySelector('.volume_class');

inputSlider.oninput = (()=>{
let value=inputSlider.value;
slideValue.textContent=value;
slideValue.style.left=(value/2)+"%";
slideValue.classList.add("show");
});

inputSlider.onblur = (()=>{
	slideValue.classList.remove("show");
});