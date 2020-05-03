import React from 'react';
import PropTypes from 'prop-types';
import SearchBox from './search-box';

const items = [{
    label: 'scoop-viewer', 
    page: 'buckets'
},{
    label: 'Settings', 
    page: 'settings'
}];

const Header = (props) => {
    const links = items.map((item, index) => {
        return (
            <a key={item.page} className={'navbar-brand header-tab ' + (props.active == item.page ? 'active' : '')} href="#" onClick={() => props.onPageChange(item.page)}>
                { index > 0 ? (<div className="header-tab-arrow left"/>) : '' }
                <p>{ item.label }</p>
                <div className="header-tab-arrow right"/>
            </a>
        );
    });
    return (
        <nav className="navbar navbar-expand-lg navbar-light header">
            { links }
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{'margin-left': '30px'}}>
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="https://github.com/prezesp" rel='noopener noreferrer' target="_blank"><i className="fa fa-github" aria-hidden="true"></i> Website</a>
                    </li>
                </ul>
                <SearchBox onSearch={props.onSearch}/>
            </div>
        </nav>
    );
};

Header.propTypes = {
    active: PropTypes.string,
    onSearch: PropTypes.func,
    onPageChange: PropTypes.func
};

export default Header;
