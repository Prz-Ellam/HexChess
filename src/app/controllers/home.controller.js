import view from '@views/home.html';

export class HomeController {

    constructor() {
        
        import('@styles/home.css');
        import('@styles/styles.css');

        const root = document.getElementById('root');
        root.innerHTML = view;
        this.initController();

    }

    initController() {

        document.getElementsByClassName('loader-wrapper')[0].style.display = 'none';
        document.getElementsByClassName('home-content')[0].style.display = 'block';
        document.getElementById('fab').addEventListener('click', event => {
            shareScore(100);
      })

        window.fbAsyncInit = function() {
            FB.init({
              appId      : '447339420703828',
              xfbml      : true,
              version    : 'v2.9'
            });
            FB.AppEvents.logPageView();
          };
          
          (function(d, s, id){
             var js, fjs = d.getElementsByTagName(s)[0];
             if (d.getElementById(id)) {return;}
             js = d.createElement(s); js.id = id;
             js.src = "//connect.facebook.net/en_US/sdk.js";
             fjs.parentNode.insertBefore(js, fjs);
           }(document, 'script', 'facebook-jssdk'));
          
          
          function shareScore(score) {
              FB.ui({
                  method: 'share',
                  href: 'https://developers.facebook.com/docs/',
                  hashtag: '#tarea',
                  quote: 'Mi puntuación fue de: ' + score
              }, function(response) {});
          }
          
          
          //shareScore(100);
        
    }

}

