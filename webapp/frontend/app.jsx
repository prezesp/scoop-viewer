import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import BottomPanel from './components/bottom-panel';
import BucketsList from './components/buckets-list';
import BucketContainer from './components/bucket-container';
import Header from './components/header';
import SettingsPage from './pages/settings';
import MyComponent from 'react-fullpage-custom-loader'

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            all: true,
            apps: 0,
            currentBucket: 'Main-bucket',
            query: '',
            page: 'buckets',
            updating: false,
            updating_msg: ''
        };
        this.apiRoot = this.props.apiRoot;
        this.changePage = this.changePage.bind(this);
        this.handleBucketChange = this.handleBucketChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    changePage(pageName) {
        this.setState({ page: pageName });
    }

    handleBucketChange(bucket) {
        this.setState({ page: 'buckets', query:'', currentBucket: bucket });
    }

    handleSearch(newQuery) {
        this.setState({ query: newQuery });
    }

    render() {
        const page = this.state.page == 'buckets' ? 
            (<BucketContainer name={this.state.currentBucket}
                all={this.state.all}
                query={this.state.query}
                handleLoad= {(apps) => this.setState({ apps })}
                apiRoot={this.apiRoot}/>) :
            (<SettingsPage apiRoot={this.apiRoot} />);
        const loader = this.state.updating ? (<MyComponent sentences={[this.state.updating_msg]} fadeIn/>) : (<div/>);
        return (
            <div>
                <div className="container-fluid">
                    <div className="row">
                        <nav className="col-md-3 hidden-xs-down bg-faded sidebar">
                            <BucketsList handleBucketChange={this.handleBucketChange} apiRoot={this.apiRoot}/>
                        </nav>
                        <main className="col-md-9 offset-md-3 pt-2">
                            <Header active={this.state.page} onSearch={this.handleSearch} onPageChange={this.changePage}/>
                            { page }
                        </main>
                        <BottomPanel
                            apps={ this.state.apps }
                            handleToggle= {(all) => this.setState({ all })}
                            handleUpdating = { (updating, updating_msg) => this.setState({ updating, updating_msg }) }/>
                    </div>
                </div>
                {loader}
            </div>
        );
    }
}

App.propTypes = {
    apiRoot: PropTypes.string
};

var appContainer = document.getElementById('app');
ReactDOM.render(<App {...(appContainer.dataset)}/>, appContainer);
