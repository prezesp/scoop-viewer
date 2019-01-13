import React, { Component } from 'react';
import InstallButton from './buttons/install-button';
import UninstallButton from './buttons/uninstall-button';
import axios from 'axios';
import PropTypes from 'prop-types';

const config = {
    POLLING_INTERVAL: 200,
    PROGRESS_INTERVAL: 100,
    PERCENT_PER_INTERVAL: 0.04
};

class ItemLogic {
    constructor(props) {
        this.apiRoot = props.apiRoot;
        this.appName = props.name;

        this.onInstall = props.onInstall;
        this.onProgress = props.onProgress;
        this.onUninstall = props.onUninstall;

        this.install = this.install.bind(this);
        this.uninstall = this.uninstall.bind(this);
        this.progress = this.progress.bind(this);
        this.pollInstallStatus = this.pollInstallStatus.bind(this);
    }

    install() {
        axios.get(this.apiRoot + `/app/${this.appName}/install`, {
            headers: { Pragma: 'no-cache'}
        }).then(() => {
            this.fileSize = null;
            this.timer = setInterval(() => this.pollInstallStatus(), config.POLLING_INTERVAL);
        });
    }

    uninstall() {
        axios.get(this.apiRoot + `/app/${this.appName}/uninstall`,{
            headers: { Pragma: 'no-cache'}
        }).then(() => {
            this.onUninstall();
        });
    }
    
    progress() {
        this.fileSizeLeft -= config.PERCENT_PER_INTERVAL;
        let percent = Math.round((1 - (this.fileSizeLeft / this.fileSize)) * 10000)/100;
        if (percent <= 100 ) {
            this.onProgress(percent);
        }
    }

    pollInstallStatus() {
        axios.get(this.apiRoot + `/app/${this.appName}/get_status`, {
            headers: { Pragma: 'no-cache'}
        }).then((res) => {
            if (this.fileSize == null && res.data.size_in_mb ) {
                this.fileSize =  Math.ceil(parseFloat(res.data.size_in_mb));
                this.fileSizeLeft = this.fileSize;
                this.timer2 = setInterval(() => this.progress(), config.PROGRESS_INTERVAL);                    
            }
            if (res.data.status === 'done') {
                this.fileSizeLeft = 0;
                this.progress();
                this.onInstall();

                this.fileSize = this.fileSizeLeft = null;
                clearInterval(this.timer);
                clearInterval(this.timer2);
                this.timer = this.timer2 = null;
            }
        });
    }
}

class BucketContentItem extends Component {
    constructor(props) {
        super(props);
        this.state = {... props};
        this.apiRoot = this.props.apiRoot;

        this.onInstall = this.onInstall.bind(this);
        this.onUninstall = this.onUninstall.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.logic = new ItemLogic({
            name: this.state.name,
            apiRoot: this.apiRoot,
            onInstall: this.onInstall,
            onUninstall: this.onUninstall,
            onProgress: this.onProgress
        });
    }

    onInstall() {
        this.setState({ 
            installed: true,
            progressStyle: {},
            showProgress : false
        });
    }

    onUninstall() {
        this.setState({ installed: false });
    }

    onProgress(percent) {
        if (percent < 100) {
            this.setState({
                progressStyle:  {
                    width: `${percent}%`,
                },
                showProgress : true
            });
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-9">
                    <h4>{ this.state.name }</h4>
                    <p>{ this.state.description }</p>
                    <p><small><a href={this.state.homepage} rel='noopener noreferrer' target="_blank">{this.state.homepage}</a></small></p>
                </div>
                <div className="col-sm-3 text-right">
                    { this.state.installed ? (<UninstallButton onClick={this.logic.uninstall}/>) : (<InstallButton onClick={this.logic.install}/>) }
                </div>
                { this.state.showProgress ?
                    <div className="col-sm-12">
                        <div className="progress">
                            <div className="progress-bar progress-bar-striped progress-bar-animated" 
                                role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" 
                                style={ this.state.progressStyle }></div>
                        </div>
                    </div>
                    : null }
            </div>
        );
    }
}

BucketContentItem.propTypes = {
    apiRoot: PropTypes.string
};

export default BucketContentItem;
