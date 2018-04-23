import React, { Component } from 'react';

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
                    value={this.state.query} 
                    onChange={event => this.setState({query: event.target.value})}
                    onKeyPress={this.handleKeyPress}/>
            </div>
        )
    }
}

export default SearchBox;