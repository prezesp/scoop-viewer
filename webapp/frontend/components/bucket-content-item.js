import React, { Component } from 'react';
import InstallButton from './buttons/install-button';
import UninstallButton from './buttons/uninstall-button';

class BucketContentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {... props};
        this.apiRoot = this.props.apiRoot;

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
                    { this.state.installed ? (<UninstallButton onUninstall={this.onUninstall} name={this.state.name} apiRoot={this.apiRoot}/>) : (<InstallButton onInstall={this.onInstall} name={this.state.name} apiRoot={this.apiRoot}/>) }
                </div>
                <div className="col-sm-12">
                    <hr/>
                </div>
            </div>
        )
    }
}

export default BucketContentItem;
