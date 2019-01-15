import React, { Component }  from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

class AddBucketDialog extends Component {
    constructor(props) {
        super(props);
        this.addRef = React.createRef();
        this.closeModal = React.createRef();
        this.handleCancel = this.handleCancel.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.apiRoot = this.props.apiRoot;
        this.onCompleted = this.props.onCompleted;

        this.state = {
            name: '',
            url: '',
            pending: false,
            msg: ''
        };
    }
    
    handleCancel() {
        this.setState({
            name: '',
            url: '',
            pending: false,
            msg: ''
        });
    }

    handleClick() {
        this.setState({ pending: true });
        var ladda = window.Ladda.create(this.addRef.current);
        ladda.start();
        axios.post(this.apiRoot + '/bucket', {
            name: this.state.name,
            url: this.state.url
        }, {
            headers: { Pragma: 'no-cache'}
        }).then(() => {
            this.onCompleted();
            this.closeModal.current.click();
            ladda.stop();
            this.setState({ pending: false });
        }).catch(() => {
            ladda.stop();
            this.setState({ pending: false, msg: 'Could not add new bucket :(' });
        });
    }

    render() {
        return (<div className="modal fade" id="exampleModal" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
            data-backdrop="false">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Add new bucket</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" ref={this.closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {this.state.msg ? 
                            <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <strong>Oops...</strong> {this.state.msg}
                            </div> :
                            null}
                        <form>
                            <div className="form-group row">
                                <label htmlFor="staticEmail" className="col-sm-1 col-form-label">Name:</label>
                                <div className="col-sm-11">
                                    <input type="text" className="form-control form-control-sm" id="staticEmail" placeholder="name"
                                        value={this.state.name} onChange={event => this.setState({name: event.target.value})} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassword" className="col-sm-1 col-form-label">Url:</label>
                                <div className="col-sm-11">
                                    <input type="text" className="form-control form-control-sm" id="inputPassword" placeholder="url"
                                        value={this.state.url} onChange={event => this.setState({url: event.target.value})} />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary btn-sm" data-dismiss="modal" onClick={this.handleCancel} disabled={this.state.pending}>Cancel</button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={this.handleClick} ref={this.addRef}>Add</button>
                    </div>
                </div>
            </div>
        </div>);
    }
}

AddBucketDialog.propTypes = {
    apiRoot: PropTypes.string,
    onCompleted: PropTypes.func
};

export default AddBucketDialog;