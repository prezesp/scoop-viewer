import React from 'react';
import ReactDOM from 'react-dom';
import Hotkeys from 'react-hot-keys';
import PropTypes from 'prop-types';
import BucketsList from './components/buckets-list';
import BucketContainer from './components/bucket-container';
import Header from './components/header';
import QuickCommandDialog from './components/dialogs/quick-command-dialog';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentBucket: 'Main-bucket',
            query: ''
        };
        this.apiRoot = this.props.apiRoot;
        this.handleBucketChange = this.handleBucketChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this._bucketlist = React.createRef();
    }

    handleBucketChange(bucket) {
        this.setState({query:'', currentBucket: bucket});
    }

    handleSearch(newQuery) {
        this.setState({query: newQuery});
    }

    onKeyDown() {
        document.getElementById('quick-command-trigger').click();
        setTimeout(() => {
            document.getElementById('quick-command').focus();
        }, 200);
    }

    render() {
        return (
            <Hotkeys 
                keyName="shift+p" 
                onKeyDown={this.onKeyDown.bind(this)}>
                <div>
                    <div className="container-fluid">
                        <div className="row">
                            <nav className="col-md-3 hidden-xs-down bg-faded sidebar">
                                <BucketsList 
                                    ref={this._bucketlist} 
                                    handleBucketChange={this.handleBucketChange} 
                                    apiRoot={this.apiRoot}/>
                            </nav>
                            <main className="col-md-9 offset-md-3 pt-2">
                                <Header onSearch={this.handleSearch}/>
                                <BucketContainer 
                                    name={this.state.currentBucket} 
                                    query={this.state.query} 
                                    apiRoot={this.apiRoot}/>
                            </main>
                        </div>
                    </div>
                </div>
                <QuickCommandDialog 
                    apiRoot={this.props.apiRoot} 
                    onSearch={this.handleSearch} 
                    onCompleted={() => this._bucketlist.current.getBuckets()}/>
                <a id="quick-command-trigger" href="#" data-toggle="modal" data-target="#quick-command-dialog">TT</a>
            </Hotkeys>
        );
    }
}

App.propTypes = {
    apiRoot: PropTypes.string
};

var appContainer = document.getElementById('app');
ReactDOM.render(<App {...(appContainer.dataset)}/>, appContainer);
