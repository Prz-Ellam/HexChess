import view from '@views/score.html';

export class ScoreController {

    constructor() {

        const root = document.getElementById('root');
        root.innerHTML = view;
        //this.initController();

        document.getElementsByClassName('loader-wrapper')[0].style.display = 'none';
        document.getElementsByClassName('container')[0].style.display = 'block';

        fetch('/api/v1/scores')
        .then(res => res.json())
        .then(res => {
            const tbody = document.getElementById('table-body');
            let i = 1;

            res.sort((a, b) =>  b.victories - a.victories);
            res.forEach(score => {
                tbody.innerHTML += `
                <tr>
                    <td>${i++}</td>
                    <td>${score.username}</td>
                    <td>${score.victories}</td>
                </tr>`;
            })
        });
        
    }

}
