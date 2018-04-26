import React, { Component } from 'react';
import axios from 'axios';
import BucketContent from './bucket-content'

const CancelToken = axios.CancelToken;

class BucketContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            name: props.name,
            query: props.query,
            pending: true
        };
        this.apiRoot = this.props.apiRoot;
    }

    _loadData() {
        let url = this.apiRoot + (this.state.query.length > 0 ? `/search/${this.state.query}` : `/bucket/${this.state.name}`);
        axios.get(url, {
            cancelToken: new CancelToken((c) => {
                this.cancel = c;
              })
        }).then(res => {
            const items = res.data;
            this.setState({ items, pending: false });
            this.cancel = null;
        });
    }

    componentDidMount() {
        console.log("--> componentDidMount");
        this._loadData();
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("--> componentDidUpdate");
        if (!prevState.pending && (prevState.name !== this.state.name || prevState.query !== this.state.query)) {
            console.log("$   componentDidUpdate - loadData", prevProps)
            console.log("$                                ", prevState)
            console.log("$                                ", this.state)
            this._loadData();
        }
        else if (prevState.pending && (prevState.name !== this.state.name || prevState.query !== this.state.query)) {
            if (this.cancel) {
                console.log("cancelling");
                this.cancel();
                this._loadData();
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.query !== prevState.query || nextProps.name !== prevState.name ) {
            
            console.log("--> Change:", nextProps.query, prevState.query, "\n", nextProps.name, prevState.name);
            return {
                items: [],
                query: nextProps.query,
                name: nextProps.name,
                pending: true,
            };
        }

        console.log("$   No state update necessary")
        // No state update necessary
        return null;
    }
    
    render() {
        const content = !this.state.pending ? (
                <BucketContent items={this.state.items} apiRoot={this.apiRoot} />
            ) : (
                <div className="text-center" style={{paddingTop:"40px"}}>
                    <p><i className="fa fa-cog fa-spin" style={{fontSize:'32px'}}></i></p>
                    <p>Loading...</p>
                </div>
            )
        return (
            <div style={{paddingTop:"5px"}}>
                {content}
            </div>
        )
    }
}

export default BucketContainer;