import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import BucketsList from './components/buckets-list';
import BucketContainer from './components/bucket-container';
import Header from './components/header';
import SettingsPage from './pages/settings';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentBucket: 'Main-bucket',
            query: '',
            page: 'buckets'
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
            (<BucketContainer name={this.state.currentBucket} query={this.state.query} apiRoot={this.apiRoot}/>) :
            (<SettingsPage apiRoot={this.apiRoot} />);
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
                    </div>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    apiRoot: PropTypes.string
};

var appContainer = document.getElementById('app');
ReactDOM.render(<App {...(appContainer.dataset)}/>, appContainer);
