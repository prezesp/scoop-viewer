import React from 'react';
import SearchBox from './search-box';

const Header = (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light header">
			<a className="navbar-brand header-tab" href="#">
				scoop-viewer
				<div class="header-tab-arrow"/>
			</a>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			  <span className="navbar-toggler-icon"></span>
			</button>
	  
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
				    <li className="nav-item">
				        <a className="nav-link" href="https://github.com/prezesp" target="_blank"><i className="fa fa-github" aria-hidden="true"></i> Website</a>
				    </li>
			    </ul>
                <SearchBox onSearch={props.onSearch}/>
			</div>
		</nav>
    );
}

export default Header;
