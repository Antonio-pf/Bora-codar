
async function getMovies() {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNGVjYTBmN2E5YTJmOGNiZjJjNTM3YmFkMzNhMzliMSIsInN1YiI6IjY0ZDk3MTMyYmYzMWYyMDFjYThkMWM0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ln1jH7Tgcpy-dyeOephUqGM0PSO8dKeZMj4OSHHMzO4'
        }
      };

      try {
        return fetch('https://api.themoviedb.org/3/movie/popular', options)
        .then(response => response.json())

      }catch (error) {
        console.log(error);
      }
      
      
      
}
//puxar info extras
// https://api.themoviedb.org/3/movie/{movie_id}

//sair da minha aplicacao para buscar dados em algum lugar -> esperar = assincrono
async function getMaisInfo(id) {
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNGVjYTBmN2E5YTJmOGNiZjJjNTM3YmFkMzNhMzliMSIsInN1YiI6IjY0ZDk3MTMyYmYzMWYyMDFjYThkMWM0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ln1jH7Tgcpy-dyeOephUqGM0PSO8dKeZMj4OSHHMzO4'
        }
      };

      try {

        const data = await   fetch('https://api.themoviedb.org/3/movie/' + id, options)

        .then(response => response.json())
        
        return data;
      } catch (error){
        console.log(error);

      }

  
}
//https://api.themoviedb.org/3/movie/{movie_id}/video
async function watch(event){

    idVideo = event.currentTarget.dataset.id

    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNGVjYTBmN2E5YTJmOGNiZjJjNTM3YmFkMzNhMzliMSIsInN1YiI6IjY0ZDk3MTMyYmYzMWYyMDFjYThkMWM0NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ln1jH7Tgcpy-dyeOephUqGM0PSO8dKeZMj4OSHHMzO4'
        }
      };
      try {
        const data = await fetch(`https://api.themoviedb.org/3/movie/${idVideo}/videos`, options)
        .then(response => response.json())

        const { results } = data

        const youtubeVideo = results.find(video => video.type === "Trailer")

        window.open(`https://youtube.com/watch?v=${youtubeVideo.key}`, 'blank')
      } catch (error) {
        console.log(error)
      }
      
     
        

}
function createMovieLayout({
    id,
    title,
    stars,
    image,
    time,
    year
}) {
    return `
                <div class="movie">
                    <div class="title">
                        <span>${title}</span>

                        <div>
                            <img src="./assets/icons/Star.svg" alt="estrela">
                            <p>${stars}</p>
                        </div>
                    </div>

                    <div class="poster">
                        <img src="https://image.tmdb.org/t/p/w500${image}" alt="imagem de ${title}">
                    </div>

                    <div class="info">
                        <div class="duracao">
                            <img src="assets/icons/Clock.svg" alt="relogio-tempo">

                            <span>${time}</span>
                        </div>
                        <div class="${year}}">
                            <img src="assets/icons/CalendarBlank.svg" alt="calendario">
                            <span>2023</span>
                        </div>
                    </div>

                    <button onclick="watch(event)" data-id="${id}">
                     <img src="assets/icons/Play.svg" alt="botao comecar">
                   
                     <span>Assistir trailer</span>
                  </button>
                </div>
    
    `
}
function selecionaTresVideos (results) {
    const random = () => Math.floor(Math.random() * results.length);

    //set nao permite valores repetidos
    let videosSelecionados = new Set();
    while(videosSelecionados.size < 3) {
        videosSelecionados.add(results[random()].id);
    }

    return [...videosSelecionados];
}

function minutosParaHorasMinutosESegundos (minutos) {

    const date = new Date(null);
    date.setMinutes(minutos);
    return date.toISOString().slice(11,19);
}

async function start() {
    //pegar sugestao de filmes da api
    const  { results } = await getMovies()
    //pegar randomivamenet 3 filems
    const filmesAleatorios = selecionaTresVideos(results).map(async filme => {
        const infoExtra =  await getMaisInfo(filme)
       
        //organizar os dados
        const propriedades = {
            id: infoExtra.id,
            title: infoExtra.title,
            stars: Number(infoExtra.vote_average).toFixed(1),
            image: infoExtra.poster_path,
            time: minutosParaHorasMinutosESegundos(infoExtra.runtime),
            year: infoExtra.release_date.slice(0, 4)
        }

        return createMovieLayout(propriedades)
        
    })
    const retorno = await Promise.all(filmesAleatorios);
    
    
   
    // subst o content dos movies no html
    document.querySelector('.movies').innerHTML = retorno.join("")
}

start()