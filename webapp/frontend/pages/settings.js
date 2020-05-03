import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Loader from '../components/loader';
import SettingsEntry from '../components/settings-entry';
import SettingsCheckbox from '../components/settings-checkbox';

class SettingsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            name: '',
            pending: true
        };
        this.apiRoot = this.props.apiRoot;
        this._loadData = this._loadData.bind(this);
    }

    _loadData() {
        let url = this.apiRoot + '/settings?' + Date.now();
        axios.get(url).then(res => {
            const items = res.data;
            console.log(items);
            this.setState({ items });
        }).catch(err =>
        {
            console.log(err);
        }).then(() =>
        {
            // finally
            this.setState({ pending: false });
            console.log(this);
        });
    }

    componentDidMount() {
        this._loadData();
    }

    render() {
        const content = !this.state.pending ? this.state.items.map(item => {
            if (item.type == 'bool')
                return (<SettingsCheckbox id={item.id} name={item.name} value={item.value} apiRoot={this.apiRoot}/>);
            else 
                return (<SettingsEntry id={item.id} name={item.name} value={item.value} apiRoot={this.apiRoot}/>);
        }): (<Loader/>);

        return (
            <div style={{ paddingTop: '5px' }}>
                { content }
            </div>
        );
    }
}

SettingsPage.propTypes = {
    apiRoot: PropTypes.string,
};

export default SettingsPage;
