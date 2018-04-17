import React from 'react';
import ReactDOM from 'react-dom';
import BucketsList from './components/buckets-list';
import BucketContent from './components/bucket-content'

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          currentBucket: 'main'
        };

        this.handleBucketChange = this.handleBucketChange.bind(this);
    }

    handleBucketChange(bucket) {
        //console.log(bucket);
        this.setState({currentBucket: bucket})
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-3" style={{'paddingTop': '20px', 'background': '#292929', 'minHeight': '100%'}}>
                        <BucketsList handleBucketChange={this.handleBucketChange}/>
                    </div>
                    <div className="col-sm-9">
                        <BucketContent url={this.state.currentBucket}/>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('app'));
