import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {resetErrorMessage} from '../actions';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class ErrorDialog extends React.Component {
  static propTypes = {
    errorMessage: PropTypes.string,
    level: PropTypes.string,
    open: PropTypes.bool.isRequired,
    resetError: PropTypes.func.isRequired
  }
  onClick = () => {
    this.props.resetError();
  }
  render() {
    const {errorMessage, open, level} = this.props;
    const actions = (
      <FlatButton primary={true} label="确定" onClick={this.onClick} />
    );
    const props = {
      actions, open,
      title: level === 'info' ? '消息' : 'Oops',
      modal: level !== 'info'
    };
    const style = {color: level === 'info' ? 'black' : 'rgb(244, 67, 54)'};
    return (
      <Dialog {...props}>
        <p style={style}>{errorMessage}</p>
      </Dialog>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {errorMessage: {level, message: errorMessage}} = state;
  const open = !!errorMessage;
  return {...ownProps, errorMessage, open, level};
};

const mapDispatchToProps = dispatch => ({
  resetError: () => dispatch(resetErrorMessage())
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorDialog);
