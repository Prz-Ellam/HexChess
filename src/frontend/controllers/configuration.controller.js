import view from '@views/configuration.html';

export class ConfigurationController {

    constructor() {

        const root = document.getElementById('root');
        root.innerHTML = view;
        this.initController();
    }

    initController() {

        //document.getElementsByClassName('content')[0].style.display = 'block';
        
        /*
       document.getElementById('btn-graficos').addEventListener('click', function(e) {
           document.getElementsByClassName('audio')[0].style.display = 'none';
           document.getElementsByClassName('controles')[0].style.display = 'none';
           document.getElementsByClassName('graficos')[0].style.display = 'block';
        });
        
        document.getElementById('btn-audio').addEventListener('click', function(e) {
            document.getElementsByClassName('audio')[0].style.display = 'block';
            document.getElementsByClassName('graficos')[0].style.display = 'none';
            document.getElementsByClassName('controles')[0].style.display = 'none';
        });

        document.getElementById('btn-controles').addEventListener('click', function(e) {
            document.getElementsByClassName('audio')[0].style.display = 'none';
            document.getElementsByClassName('graficos')[0].style.display = 'none';
            document.getElementsByClassName('controles')[0].style.display = 'block';
        });
*/



        const settings = JSON.parse(localStorage.getItem('settings'));
        const shadows = document.getElementById('shadows');
        shadows.checked = settings.shadows;
        
        const fov = document.getElementById('fov');
        fov.value = settings.fov;

        const antialias = document.getElementById('antialias');
        antialias.checked = settings.antialias;

        const encoding = settings.encoding;
        switch (encoding) {
            case 'srgb': {
                const srgb = document.getElementById('srgb');
                srgb.checked = true;
                break;
            }
            case 'linear': {
                const linear = document.getElementById('linear');
                linear.checked = true;
                break;
            }
        }


        const elements = document.getElementById('graphics-form').elements;
        //console.log(elements);
        const a = Array.from(elements).map(element => element.name);
        console.log(a);

        const fovValue = document.getElementById('fov-value');
        fovValue.innerText = settings.fov;
        
        document.getElementById('fov').addEventListener('change', event => {
            const fovValue = document.getElementById('fov-value');
            fovValue.innerText = event.target.value;
        });
        document.getElementById('fov').addEventListener('input', event => {
            const fovValue = document.getElementById('fov-value');
            fovValue.innerText = event.target.value;
        });

        document.getElementById('graphics-form').addEventListener('submit', function(event) {
            event.preventDefault();
            var formData = new FormData(this)

            const obj = Object.fromEntries(formData);

            const settings = {
                fov: obj.fov,
                shadows: (obj.shadows !== undefined) ? true : false,
                antialias: (obj.antialias !== undefined) ? true : false,
                encoding: (obj.encoding !== undefined) ? obj.encoding : 'srgb'
            }
            localStorage.setItem('settings', JSON.stringify(settings));

            const data = [...formData.entries()];
            console.log(data);
            
        });

    }

}
