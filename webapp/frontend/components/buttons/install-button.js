import React, { Component } from 'react';
import axios from 'axios';

class InstallButton extends Component {
    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
        this.handleInstallClick = this.handleInstallClick.bind(this);
        this.onInstall = props.onInstall;
    }

    handleInstallClick() {
        console.log(this.buttonRef);
        var l = Ladda.create(this.buttonRef.current);
        l.start();
        //todo aplikacja
        axios.get(`http://localhost:5030/app/${this.props.name}/install`)
            .then(res => {
                //parse result
                //this.setState({ buckets });
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