import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import AddBucketDialog from './dialogs/add-bucket-dialog';

class BucketsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buckets: []
        };
        this.apiRoot = this.props.apiRoot;

        this.handleBucketChange = this.props.handleBucketChange;
        this.getBuckets = this.getBuckets.bind(this);
    }

    componentDidMount() {
        this.getBuckets();
    }
    
    getBuckets() {
        axios.get(this.apiRoot + '/buckets', {
            headers: { Pragma: 'no-cache'}
        }).then(res => {
            const buckets = res.data;
            this.setState({ buckets });
        });
    }

    handleClick(e, bucket) {
        this.handleBucketChange(bucket);
    }

    render() {
        const isFetched = this.state.buckets.length !== 0;
        const content = isFetched ? (
            this.state.buckets.map((item, index) => (
                <li key={index} className="nav-item">
                    <a className="nav-link active" href="#" onClick={(e) => this.handleClick(e, item.name)}>
                        <i className="fa fa-angle-right" style={{color: '#cacaca', paddingRight: '8px'}}></i>
                        {item.name}
                    </a>
                </li>

            ))
        ) : (
            <div className="text-center">
                <p><i className="fa fa-cog fa-spin" style={{fontSize:'32px', color:'#fff'}}></i></p>
                <p style={{color:'#fff'}}>Loading...</p>
            </div>
        );
        return (
            <div>
                <ul className="nav flex-column">
                    {content}
                    <li className="add-item">
                        <a className="nav-link active" href="#" data-toggle="modal" data-target="#exampleModal">
                            <i className="fa fa-plus" style={{color: '#cacaca', paddingRight: '8px'}}></i>
                        </a>
                    </li>
                    <AddBucketDialog apiRoot={this.props.apiRoot} onCompleted={() => this.getBuckets()}/>
                </ul>
            </div>
        );
    }
}

BucketsList.propTypes = {
    apiRoot: PropTypes.string,
    handleBucketChange: PropTypes.func
};

export default BucketsList;