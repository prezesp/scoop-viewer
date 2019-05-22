import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ReactAutocomplete from 'react-autocomplete';
import commands_config from '../utils/commands';

class QuickCommandDialog extends Component {
    constructor(props) {
        super(props);
        this.onSearch = this.props.onSearch;

        this.state = {
            command: commands_config[0],
            value: ''
        };
    }
    
    render() {
        return (<div className="modal fade" id="quick-command-dialog" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
            data-backdrop="false">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-body">
                        <form>
                            <div className="form-group row">
                                <div className="col-sm-12">
                                
                                    <ReactAutocomplete
                                        items={this.state.command.get_options()}
                                        wrapperStyle = {{ display: 'block' }}
                                        shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                                        getItemValue={item => item.id}
                                        renderInput={(props) => 
                                            <div class="input-group input-group-sm">
                                                { this.state.command.prefix ?
                                                    <div class="input-group-prepend">
                                                        <div class="input-group-text">{this.state.command.prefix}</div>
                                                    </div>
                                                : null}
                                                
                                                <input {...props} id='quick-command' className='form-control form-control-sm' 
                                                    onKeyPress={(e)=> {
                                                        if (e.key === 'Enter') {
                                                            let selectedCommand = this.state.command.get('on-enter');
                                                            if (selectedCommand.action) {
                                                                selectedCommand.action(e.target.value, this);
                                                            }
                                                        }
                                                    }}/>
                                            </div>
                                        }
                                        renderMenu={(items) => 
                                            <div style={{
                                                position: 'relative'
                                            }}>
                                            {items}
                                            </div>
                                        }
                                        renderItem={(item, highlighted) =>
                                        <div
                                            key={item.id}
                                            style={{ 
                                                backgroundColor: highlighted ? '#ccc' : 'transparent',
                                                left: 0,
                                                position: 'relative'
                                            }}
                                        >
                                            {item.label}
                                        </div>
                                        }
                                        value={this.state.value}
                                        onChange={e => this.setState({ value: e.target.value })}
                                        onSelect={value => {
                                            let selectedCommand = this.state.command.get(value)
                                            if (selectedCommand.action) {
                                                selectedCommand.action(value, this);
                                            } else {
                                                this.setState({ command: this.state.command.get(value)});
                                            }
                                            this.setState({ value: ''});
                                        }}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>);
    }

    componentDidMount() {
        let self = this;
        let myModal = document.getElementById('quick-command-dialog');
        myModal.addEventListener('hidden.bs.modal', function(event) {
            self.setState({ 
                command: commands_config[0],
                value: ''
            });
        }, false);
    }
}

QuickCommandDialog.propTypes = {
    apiRoot: PropTypes.string
};

export default QuickCommandDialog;