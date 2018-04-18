import React from 'react';
import ReactDOM from 'react-dom';
import BucketsList from './components/buckets-list';
import BucketContainer from './components/bucket-container';
import Menu from './components/menu';

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
    }

    handleBucketChange(bucket) {
        //console.log(bucket);
        this.setState({query:'', currentBucket: bucket});
    }

    handleSearch(newQuery) {
        this.setState({query: newQuery});
    }

    render() {
        return (
            <div>
                <Menu onSearch={this.handleSearch}/>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-3" style={{'paddingTop': '20px', 'background': '#292929', 'minHeight': '100%'}}>
                            <BucketsList handleBucketChange={this.handleBucketChange} apiRoot={this.apiRoot}/>
                        </div>
                        <div className="col-sm-9">
                            <BucketContainer name={this.state.currentBucket} query={this.state.query} apiRoot={this.apiRoot}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App {...(app.dataset)}/>, document.getElementById('app'));
