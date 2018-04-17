import React, { Component } from 'react';
import InstallButton from './buttons/install-button';
import UninstallButton from './buttons/uninstall-button';

class BucketItem extends Component {
    constructor(props) {
        super(props);
        this.state = {... props};

        this.onInstall = this.onInstall.bind(this);
        this.onUninstall = this.onUninstall.bind(this);
    }

    onInstall() {
        this.setState({installed: true})
    }

    onUninstall() {
        this.setState({installed: false})
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-10">
                    <h4>{ this.state.name }</h4>
                    <p>{ this.state.description }</p>
                    <p><small>{ this.state.website} </small></p>
                </div>
                <div className="col-sm-2 text-right">
                    { this.state.installed ? (<UninstallButton onUninstall={this.onUninstall}/>) : (<InstallButton onInstall={this.onInstall}/>) }
                </div>
            </div>
        )
    }
}

export default BucketItem;
