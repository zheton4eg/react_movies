import React from "react";
import Preloader from "../components/Preloader.js";
import MovieList from "../components/MovieList.js";
import SearchForm from "../components/SearchForm.js"; // Создадим новый компонент для формы поиска
import './Main.css';

class Main extends React.Component {
    state = {
        movies: [],
        searchTerm: "matrix", // Начальное значение, чтобы при первой загрузке что-то показывать
        loading: false, // Добавляем состояние загрузки
        error: null // Добавляем состояние для ошибок
    }

    // Вынесем логику запроса в отдельную функцию
    searchMovies = (searchQuery) => {
        this.setState({ loading: true, error: null }); // Начинаем загрузку, сбрасываем ошибки

        fetch(`https://omdbapi.com/?apikey=fa5c825f&s=${encodeURIComponent(searchQuery)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка сети: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.Response === "True") {
                    this.setState({ movies: data.Search, loading: false });
                } else {
                    // Если API вернуло ошибку (например, "Movie not found!")
                    throw new Error(data.Error || "Неизвестная ошибка при поиске фильмов.");
                }
            })
            .catch(error => {
                console.error("Ошибка при запросе к API:", error);
                this.setState({ 
                    error: error.message, 
                    movies: [], // Очищаем список фильмов при ошибке
                    loading: false 
                });
            });
    }

    componentDidMount() {
        // Вызываем поиск с начальным значением при загрузке компонента
        this.searchMovies(this.state.searchTerm);
    }

    // Обработчик изменения значения в input
    handleInputChange = (event) => {
        this.setState({ searchTerm: event.target.value });
    }

    // Обработчик отправки формы
    handleSearchSubmit = (event) => {
        event.preventDefault(); // Предотвращаем перезагрузку страницы
        const { searchTerm } = this.state;
        if (searchTerm.trim()) { // Проверяем, что строка не пустая
            this.searchMovies(searchTerm);
        }
    }

    render() {
        const { movies, loading, error, searchTerm } = this.state;

        return (
            <div className='main'>
                <div className='wrap'>
                    {/* Добавляем форму поиска */}
                    <SearchForm 
                        searchTerm={searchTerm}
                        onInputChange={this.handleInputChange}
                        onSearchSubmit={this.handleSearchSubmit}
                        loading={loading}
                    />

                    {/* Отображаем прелоадер, ошибку или список фильмов */}
                    {loading && <Preloader />}
                    {error && <div className="error-message">Ошибка: {error}</div>}
                    {!loading && !error && movies.length > 0 && <MovieList movies={movies} />}
                    {!loading && !error && movies.length === 0 && searchTerm.trim() !== "" && (
                        <div className="no-movies">По запросу "{searchTerm}" ничего не найдено.</div>
                    )}
                </div>
            </div>
        )
    }
}

export default Main;