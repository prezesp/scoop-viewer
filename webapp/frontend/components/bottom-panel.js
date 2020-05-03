import React, { Component } from 'react';

class ToggleInstalledButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            all: true
        };
        this.handleToggle = this.props.handleToggle;
    }

    toggle() {
        this.handleToggle(!this.state.all);
        this.setState({ all: !this.state.all });
    }

    render() {
        return (
            <div className="btn-group show dropup" role="group">
                <button id="btnGroupDrop1" type="button" className="btn btn-sm btn-bottom-panel dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                { this.state.all ? 'All' : 'Installed' }
                </button>
                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="btnGroupDrop1">
                    <a className="dropdown-item" href="#" onClick={ () => this.toggle() }>{ !this.state.all ? 'All' : 'Installed' }</a>
                </div>
            </div>
        );
    }
};

const BottomPanel = (props) => {
    return (
        <div className="fixed-bottom bottom-panel">
            <div className="container-fluid">
                <div className="row">
                    <div className="offset-md-8 col-md-4 text-right">
                        <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                            <button type="button" className="btn btn-sm btn-bottom-panel">
                                Packages <span class="badge badge-light">{ props.apps }</span>
                            </button>
                            <ToggleInstalledButton handleToggle={props.handleToggle}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BottomPanel;
