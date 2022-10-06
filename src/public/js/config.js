var actvolume=document.getElementById('checbox-act-des');
var volume=document.getElementById('volume-range');
var titlevolume=document.getElementById('activate_id');
var titlevolume2=document.getElementById('volumensb_id');

var titlebrillo=document.getElementById('aumentar-brillo');
var brillo=document.getElementById('brillo-range');


$('#btn-brillo').click(function(){
	volume.hidden=true;
	actvolume.hidden=true;
	titlevolume.hidden=true;
	titlevolume2.hidden=true;

	
	titlebrillo.hidden=false;
	brillo.hidden=false;
});

$('#btn-sonido').click(function(){
	volume.hidden=false;
	actvolume.hidden=false;
	titlevolume.hidden=false;
	titlevolume2.hidden=false;

	titlebrillo.hidden=true;
	brillo.hidden=true;
});