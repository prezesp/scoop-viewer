import React, { Component } from 'react';
import BucketItem from './bucket-item'
import axios from 'axios';


class BucketContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
          items: [],
          url: props.url,
          pending: true
        };
    }

    componentDidMount() {
        axios.get(`http://localhost:5030/bucket/${this.state.url}`)
            .then(res => {
                const items = res.data;
                this.setState({ items, pending:false });
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.url !== this.props.url) {
            this.setState({url:nextProps.url, pending: true});
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.url !== this.props.url || nextState.items.length !== this.state.items.length;
    }


    componentDidUpdate() {
        axios.get(`http://localhost:5030/bucket/${this.state.url}`)
            .then(res => {
                const items = res.data;
                this.setState({ items, pending: false });
                console.log("nowy stan", this.state.items[0].name);
        });
    }

    render() {
        const content = !this.state.pending ? (
                this.state.items.map(item => (
                    <BucketItem key={item.name} {...item}/>
                ))
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

export default BucketContent;