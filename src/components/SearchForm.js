import React from "react";

const SearchForm = ({ searchTerm, onInputChange, onSearchSubmit, loading }) => {
    return (
        <form className="search-form" onSubmit={onSearchSubmit}>
            <input
                type="text"
                value={searchTerm}
                onChange={onInputChange}
                placeholder="Введите название фильма..."
                disabled={loading} // Блокируем input во время загрузки
            />
            <button type="submit" disabled={loading}>
                {loading ? "Поиск..." : "Найти"}
            </button>
        </form>
    );
};

export default SearchForm;