import React, { Component } from 'react';
import axios from 'axios';

class UninstallButton extends Component {
    constructor(props) {
        super(props);
        this.buttonRef = React.createRef();
        this.handleUninstallClick = this.handleUninstallClick.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.onUninstall = this.props.onUninstall;
        this.apiRoot = this.props.apiRoot;
        this.state = {
            showDropdown: false
        }
    }

    handleUninstallClick() {    
        var l = Ladda.create(this.buttonRef.current);
        l.start();
        axios.get(this.apiRoot + `/app/${this.props.name}/uninstall`)
            .then(res => {
                l.stop();
                this.onUninstall();
        });
    }

    show() {
        this.setState({ showDropdown: true})
        document.addEventListener("click", this.hide);
    }

    hide() {
        this.setState({ showDropdown: false})
        document.removeEventListener("click", this.hide);
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
                        aria-expanded="false"
                        onClick={this.show}>
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    {this.state.showDropdown ?
                        <div 
                            className="dropdown-menu dropdown-menu-right" 
                            aria-labelledby="btnGroupDrop{{app['name']}}" 
                            style={{fontSize: '.875rem', padding: 0, display: 'block'}}>
                            <a 
                                className="dropdown-item" 
                                data-app="{{ app['name'] }}"
                                onClick={this.handleUninstallClick}>Uninstall</a>
                        </div> :
                        null}
                </div>
            </div>
        )
    }
}

export default UninstallButton;
