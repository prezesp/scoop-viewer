import React, { Component } from 'react';
import axios from 'axios';

class BucketsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
          buckets: []
        };
        this.apiRoot = this.props.apiRoot;

        this.handleBucketChange = props.handleBucketChange;
    }

    componentDidMount() {
        axios.get(this.apiRoot +`/buckets`)
            .then(res => {
                const buckets = res.data;
                this.setState({ buckets });
        });
    }

    handleClick(e, bucket) {
        this.handleBucketChange(bucket);
    }

    render() {
        const isFetched = this.state.buckets.length != 0;
        const content = isFetched ? (
                this.state.buckets.map((item, index) => (
                    <li key={index} className="nav-item">
                        <a className="nav-link active" href="#" onClick={(e) => this.handleClick(e, item.name)}>{item.name}</a>
                    </li>

                ))
            ) : (
                <div className="text-center">
                    <p><i className="fa fa-cog fa-spin" style={{fontSize:'32px', color:'#fff'}}></i></p>
                    <p style={{color:'#fff'}}>Loading...</p>
                </div>
            )
        return (
            <ul className="nav flex-column">
                {content}
            </ul>
        )
    }
};

export default BucketsList;