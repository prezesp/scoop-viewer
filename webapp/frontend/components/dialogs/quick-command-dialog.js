import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ReactAutocomplete from 'react-autocomplete';
import commands_config from '../utils/commands';

class QuickCommandDialog extends Component {
    constructor(props) {
        super(props);
        this.closeModal = React.createRef();

        this.apiRoot = this.props.apiRoot;
        this.onCompleted = this.props.onCompleted;
        this.onSearch = this.props.onSearch;
        this.onSave = (name, url) => {
            this.setState({ pending: true });
            axios.post(this.apiRoot + '/bucket', {
                name: name,
                url: url
            }, {
                headers: { Pragma: 'no-cache'}
            }).then(() => {
                this.onCompleted();
                this.closeModal.current.click();
                this.setState({ pending: false });
            }).catch(() => {
                this.setState({ pending: false, msg: 'Could not add new bucket :(' });
            });
        }
        this.handleClick = this.handleClick.bind(this);

        this.state = {
            command: commands_config[0],
            msg: '',
            value: ''
        };
    }

    handleClick() {
        this.setState({ msg: '' });
    }
    
    render() {
        return (<div className="modal fade" id="quick-command-dialog" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
            data-backdrop="false">
            <div className="modal-dialog" role="document">
                <button type="button" className="close d-none" data-dismiss="modal" aria-label="Close" ref={this.closeModal}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <div className="modal-content">
                    <div className="modal-body">
                        {this.state.msg ? 
                            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.handleClick}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <strong>Oops...</strong> {this.state.msg}
                            </div>
                        : null}
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
                                                                selectedCommand.action(this, e.target.value, this.state.command.args_stack);
                                                                this.state.command.args_stack = [];
                                                            } else {
                                                                // if value not consumed, forward it
                                                                selectedCommand.args_stack = this.state.command.args_stack;
                                                                selectedCommand.args_stack.push(e.target.value);
                                                                this.setState({ 
                                                                    command: selectedCommand,
                                                                    value: ''
                                                                });
                                                            }
                                                        }
                                                    }}/>
                                                { this.state.pending ?
                                                    <div class="input-group-append">
                                                        <span class="input-group-text">
                                                        <div id="loading"></div></span>
                                                    </div>
                                                : null }
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
                                                selectedCommand.action(this, value);
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