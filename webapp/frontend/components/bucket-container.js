import React, { Component } from 'react';
import axios from 'axios';
import BucketContent from './bucket-content'


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

    componentDidMount() {
        let url = this.apiRoot + (this.state.query.length > 0 ? `/search/${this.state.query}` : `/bucket/${this.state.name}`);
        axios.get(url)
            .then(res => {
                const items = res.data;
                this.setState({ items, pending:false });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.name !== this.props.name) {
            this.setState({name:nextProps.name, pending: true});
        }
        if (nextProps.query !== this.props.query) {
            this.setState({query:nextProps.query, pending: true});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.name !== this.props.name || nextProps.query !== this.props.query || nextState.items.length !== this.state.items.length;
    }


    componentDidUpdate() {
        let url = this.apiRoot + (this.state.query.length > 0 ? `/search/${this.state.query}` : `/bucket/${this.state.name}`);
        axios.get(url)
            .then(res => {
                const items = res.data;
                this.setState({ items, pending: false });
        });
    }

    render() {
        const content = !this.state.pending ? (
                <BucketContent items={this.state.items} apiRoot={this.apiRoot} />
            ) : (
                <div className="text-center">
                    <p><i className="fa fa-cog fa-spin" style={{fontSize:'32px'}}></i></p>
                    <p>Loading...</p>
                </div>
            )
        return (
            <div style={{paddingTop:"25px"}}>
                {content}
            </div>
        )
    }
}

export default BucketContainer;