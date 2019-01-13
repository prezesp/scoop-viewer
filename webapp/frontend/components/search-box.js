import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.onSearch = this.props.onSearch;

        this.state = {
            query: ''
        };
    }
    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleSearch();
        }
    }

    handleSearch() {
        this.onSearch(this.state.query);
    }

    render() {
        return (
            <div className="form-inline my-2 my-lg-0">
                <input 
                    className="form-control mr-sm-2 search-box" 
                    type="search" 
                    placeholder="Search" 
                    aria-label="Search" 
                    name="q"
                    id="searchBox" 
                    value={this.state.query} 
                    onChange={event => this.setState({query: event.target.value})}
                    onKeyPress={this.handleKeyPress}/>
            </div>
        );
    }
}

SearchBox.propTypes = {
    onSearch: PropTypes.func
};

export default SearchBox;