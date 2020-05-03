import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class SettingsEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            name: this.props.name,
            value: this.props.value
        };
        this.apiRoot = this.props.apiRoot;

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const value = e.target.value;
        this.setState({ value });
        this._save(value);
    }
    
    _save(value) {
        let url = this.apiRoot + '/settings/' + this.state.id;
        axios.put(url, { value }).then(() => {
        }).catch(err =>
        {
            console.log(err);
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-4">
                    { this.state.name }
                </div>
                <div className="col-sm-8">
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </div>
            </div>
        );
    }
}

SettingsEntry.propTypes = {
    apiRoot: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string
};

export default SettingsEntry;
