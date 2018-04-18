import React, { Component } from 'react';
import axios from 'axios';

class InstallButton extends Component {
    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
        this.handleInstallClick = this.handleInstallClick.bind(this);
        this.onInstall = this.props.onInstall;
        this.apiRoot = this.props.apiRoot;
    }

    handleInstallClick() {
        var l = Ladda.create(this.buttonRef.current);
        l.start();
        axios.get(this.apiRoot + `/app/${this.props.name}/install`)
            .then(res => {
                l.stop();
                this.onInstall();
        });
    }

    render() {
        return (
            <button 
                ref={this.buttonRef}
                type="button" 
                className="btn btn-primary btn-sm" 
                onClick={this.handleInstallClick}>
                <i className="fa fa-download" aria-hidden="true"></i> Install
            </button> 
        );
    }
}

export default InstallButton;