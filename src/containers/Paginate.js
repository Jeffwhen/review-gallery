import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import PaginateView from '../components/Paginate';
import {adverseCheck, submitChecks} from '../actions';

import FlatButton from 'material-ui/FlatButton';
import DoneIcon from 'material-ui/svg-icons/action/done';
import SwapIcon from 'material-ui/svg-icons/action/swap-horiz';

class Paginate extends React.Component {
  static propTypes = {
    push: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    isFetching: PropTypes.bool.isRequired,
    adverseSelect: PropTypes.func.isRequired
  }
  onChange = index => {
    const {push, isFetching} = this.props;
    if (!isFetching) {
      push(index);
    }
  }
  render() {
    const {total, adverseSelect, submit} = this.props;
    const props = {
      onChange: this.onChange,
      ...this.props
    };
    const submitProps = {
      label: '提交',
      secondary: true,
      onClick: () => submit(),
      icon: <DoneIcon />
    };
    const adverseProps = {
      label: '反选',
      onClick: () => adverseSelect(),
      icon: <SwapIcon />
    };
    const divStyle = {
      textAlign: 'center',
      margin: '20px 0'
    };
    return total ? (
      <div style={divStyle}>
        <PaginateView {...props} />
        <FlatButton {...submitProps} />
        <FlatButton {...adverseProps} />
      </div>
    ) : null;
  }
}

const mapStateToProps = (state, ownProps) => {
  const {pagination: {images: {index, total, isFetching}}} = state;
  const {history: {push}} = ownProps;
  const pushIndex = index => push(`/${index}`);
  return {...ownProps, index, total, isFetching, push: pushIndex};
};

const mapDispatchToProps = dispatch => ({
  adverseSelect: () => dispatch(adverseCheck()),
  submit: () => dispatch(submitChecks())
});

export default connect(mapStateToProps, mapDispatchToProps)(Paginate);
