import React, { Component } from 'react';
import axios from 'axios';
import BucketContent from './bucket-content';
import PropTypes from 'prop-types';

const CancelToken = axios.CancelToken;

class BucketContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            all: true,
            items: [],
            name: props.name,
            query: props.query,
            pending: true
        };
        this.apiRoot = this.props.apiRoot;
        this.handleLoad = this.props.handleLoad;
    }

    _loadData() {
        let url = this.apiRoot + (this.state.query.length > 0 ? `/search/${this.state.query}?installed_only=${!this.state.all}` : `/bucket/${this.state.name}?installed_only=${!this.state.all}&${Date.now()}`);
        axios.get(url, {
            cancelToken: new CancelToken((c) => {
                this.cancel = c;
            })
        }).then(res => {
            const items = res.data;
            this.setState({ items, pending: false });
            this.handleLoad(items.length);
            this.cancel = null;
        });
    }

    componentDidMount() {
        this._loadData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.pending && (prevState.name !== this.state.name || prevState.query !== this.state.query)) {
            this._loadData();
        } else if (prevState.pending && (prevState.name !== this.state.name || prevState.query !== this.state.query)) {
            if (this.cancel) {
                this.cancel();
                this._loadData();
            }
        } else if (prevState.all !== this.state.all) {
            this._loadData();
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.query !== prevState.query || nextProps.name !== prevState.name || nextProps.all !== prevState.all) {
            return {
                all: nextProps.all,
                items: [],
                query: nextProps.query,
                name: nextProps.name,
                pending: true
            };
        }

        return null;
    }

    render() {
        const content = !this.state.pending ? (
            <BucketContent items={this.state.items} apiRoot={this.apiRoot} />
        ) : (
            <div className='text-center' style={{ paddingTop: '40px' }}>
                <p><i className='fa fa-cog fa-spin' style={{ fontSize: '32px' }}></i></p>
                <p>Loading...</p>
            </div>
        );
        return (
            <div style={{ paddingTop: '5px' }}>
                { content }
            </div>
        );
    }
}

BucketContainer.propTypes = {
    apiRoot: PropTypes.string,
    name: PropTypes.string,
    query: PropTypes.string
};

export default BucketContainer;
