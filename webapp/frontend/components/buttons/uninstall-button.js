import React, { Component } from 'react';
import axios from 'axios';


class UninstallButton extends Component {
    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
        this.handleUninstallClick = this.handleUninstallClick.bind(this);
        this.onUninstall = props.onUninstall;
    }

    handleUninstallClick() {
        console.log(this.buttonRef);
        var l = Ladda.create(this.buttonRef.current);
        l.start();
        axios.get(`http://localhost:5030/app/${this.props.name}/uninstall`)
            .then(res => {
                //parse result
                //this.setState({ buckets });
                l.stop();
                this.onUninstall();
        });
    }

    render() {
        return (
            <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                <button ref={this.buttonRef} type="button" className="btn btn-success btn-sm">Installed</button>

                <div className="btn-group" role="group">
                    <button 
                        id="btnGroupDrop{{app['name']}}" 
                        type="button" 
                        className="btn btn-success dropdown-toggle dropdown-toggle-split btn-sm" 
                        data-toggle="dropdown" 
                        aria-haspopup="true" 
                        aria-expanded="false">
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <div 
                        className="dropdown-menu dropdown-menu-right" 
                        aria-labelledby="btnGroupDrop{{app['name']}}" 
                        style={{fontSize: '.875rem', padding: 0}}>
                        <a 
                            className="dropdown-item" 
                            data-app="{{ app['name'] }}"
                            onClick={this.handleUninstallClick}>Uninstall</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default UninstallButton;
