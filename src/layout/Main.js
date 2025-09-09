import React from 'react';
import Preloader from '../components/Preloader.js';
import MovieList from '../components/MovieList.js';
import Search from '../components/Search.js';
import './Main.css';

class Main extends React.Component
{
 state = {movies: [], loading: false} // Добавили состояние loading

 componentDidMount()
 {
  fetch('https://omdbapi.com/?apikey=fa5c825f&s=terminator')
  .then(response=>response.json())
  .then(data=>this.setState({movies:data.Search}))
 }
 
 searchMovie = (str)=>
 {
  this.setState({loading: true}) // Устанавливаем флаг загрузки
  fetch(`https://omdbapi.com/?apikey=fa5c825f&s=${str.trim()}`)
  .then(response=>response.json())
  .then(data=>{
    // Явно проверяем успешность ответа и очищаем старые данные при ошибке
    if (data.Response === "True") {
      this.setState({movies: data.Search, loading: false})
    } else {
      this.setState({movies: [], loading: false}) // Очищаем при ошибке
    }
  })
 
 }
 
 render()
 {
  return(
     <div className='main'>
        <div className='wrap'> {/* Исправлено: classname -> className */}
          <Search searchMovie={this.searchMovie}/>
           {
            // Добавляем проверку на loading и пустой список
            this.state.loading ? <Preloader/> : 
            this.state.movies.length ? <MovieList movies={this.state.movies}/> : 
            <div>Ничего не найдено</div>
           }     
         </div>
      </div>
    )
 }
}

export default Main;