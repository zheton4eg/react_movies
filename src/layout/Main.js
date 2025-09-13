import React from 'react';
import Preloader from '../components/Preloader.js';
import MovieList from '../components/MovieList.js';
import Search from '../components/Search.js';
import './Main.css';

class Main extends React.Component {
  state = {
    movies: [],
    loading: false,
    currentPage: 1,
    moviesPerPage: 4,
    searchType: "all" // Добавляем тип поиска по умолчанию
  }

  componentDidMount() {
    // Добавляем тип в начальный запрос
    fetch('https://omdbapi.com/?apikey=fa5c825f&s=TERMINATOR&type=movie')
      .then(response => response.json())
      .then(data => this.setState({ movies: data.Search }))
  }

  // Обновляем функцию поиска с учетом типа
  searchMovie = (str, type = this.state.searchType) => {
    this.setState({ loading: true });
    
    // Формируем URL с учетом выбранного типа
    let url = `https://omdbapi.com/?apikey=fa5c825f&s=${encodeURIComponent(str.trim())}`;
    if (type !== "all") {
      url += `&type=${type}`;
    }
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.Response === "True") {
          this.setState({ 
            movies: data.Search, 
            loading: false,
            currentPage: 1,
            searchType: type // Сохраняем выбранный тип
          });
        } else {
          this.setState({ movies: [], loading: false });
        }
      })
      .catch(error => {
        this.setState({ movies: [], loading: false });
      })
  }

  // Функция для изменения типа контента
  handleTypeChange = (newType) => {
    this.setState({ searchType: newType }, () => {
      // Если есть текущий поисковый запрос, выполняем новый поиск с выбранным типом
      if (this.state.movies.length > 0) {
        this.searchMovie(this.state.searchTerm || "TERMINATOR", newType);
      }
    });
  }

  nextPage = () => {
    this.setState(prevState => ({
      currentPage: prevState.currentPage + 1
    }));
  }

  prevPage = () => {
    this.setState(prevState => ({
      currentPage: Math.max(prevState.currentPage - 1, 1)
    }));
  }

  goToPage = (pageNumber) => {
    this.setState({
      currentPage: pageNumber
    });
  }

  render() {
    const { movies, loading, currentPage, moviesPerPage, searchType } = this.state;
    
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const currentMovies = movies.slice(startIndex, endIndex);
    
    const totalPages = Math.ceil(movies.length / moviesPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return(
      <div className='main'>
        <div className='wrap'>
          {/* Передаем в Search функцию для изменения типа и текущий тип */}
          <Search 
            searchMovie={this.searchMovie} 
            searchType={searchType}
            onTypeChange={this.handleTypeChange}
          />
          
          {loading && <Preloader/>}
          
          {!loading && currentMovies.length > 0 && <MovieList movies={currentMovies}/>}
          
          {!loading && movies.length === 0 && <div>Ничего не найдено</div>}
          
          {!loading && movies.length > moviesPerPage && (
            <div className="pagination">
              <button 
                onClick={this.prevPage} 
                disabled={currentPage === 1}
                className="pagination-btn pagination-prev"
              >
                Back
              </button>
              
              <div className="page-numbers">
                {pageNumbers.map(number => (
                  <button
                    key={number}
                    onClick={() => this.goToPage(number)}
                    className={`page-number-btn ${currentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={this.nextPage}


disabled={currentPage === totalPages}
                className="pagination-btn pagination-next"
              >
                Prev
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default Main;