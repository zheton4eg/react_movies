import React from 'react';
import './Search.css';

class Search extends React.Component {
  state = {
    search: ""
  }

  handleKey = (event) => {
    if(event.key === 'Enter') {
      this.props.searchMovie(this.state.search, this.props.searchType);
    }
  }

  // Обработчик изменения типа контента
  handleTypeChange = (event) => {
    this.props.onTypeChange(event.target.value);
  }
 
  render() {
    return(
      <>
        <div className='search'>
          <input
            type="search"
            placeholder='Введите название фильма, сериала или игры'
            value={this.state.search}
            onChange={(e) => this.setState({search: e.target.value})}
            onKeyDown={this.handleKey}
            className="search-input"
          />
          
          {/* Выпадающий список для выбора типа контента */}
          <select 
            value={this.props.searchType} 
            onChange={this.handleTypeChange}
            className="type-select"
          >
            <option value="all">All</option>
            <option value="movie">Films</option>
            <option value="series">Series</option>
            <option value="game">Games</option>
          </select>
          
          <button 
            className='search-btn' 
            onClick={() => this.props.searchMovie(this.state.search, this.props.searchType)}
          >
            Поиск
          </button>
        </div>
      </>
    )
  }
}

export default Search;