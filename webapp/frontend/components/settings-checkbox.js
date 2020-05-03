import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

class SettingsCheckbox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            name: this.props.name,
            checked: this.props.value == 'true'
        };
        console.log(this.props);
        console.log(this.state);
        this.apiRoot = this.props.apiRoot;

        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    }

    handleCheckboxClick() {
        const checked = !this.state.checked;
        this.setState({ checked });
        this._save(checked.toString());
    }
    
    _save(value) {
        const url = this.apiRoot + '/settings/' + this.state.id;
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
                    <input type="checkbox" checked={this.state.checked} onChange={this.handleCheckboxClick} />
                </div>
            </div>
        );
    }
}

SettingsCheckbox.propTypes = {
    apiRoot: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string
};

export default SettingsCheckbox;
