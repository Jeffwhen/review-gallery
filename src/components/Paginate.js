import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import NextIcon from 'material-ui/svg-icons/image/navigate-next';
import PrevIcon from 'material-ui/svg-icons/image/navigate-before';
import LastIcon from 'material-ui/svg-icons/navigation/last-page';

class Paginate extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    style: PropTypes.object
  }
  state = {
    index: this.props.index + 1,
    indexError: undefined
  };
  componentWillReceiveProps(nextProps) {
    const {index:nextIndex} = nextProps;
    const {index: prevIndex} = this.props;
    if (nextIndex !== prevIndex) {
      this.setState({index: nextIndex + 1});
    }
  }
  onChange = event => {
    event.preventDefault();
    event.stopPropagation();
    const {index, indexError} = this.state;
    if (indexError) {
      return;
    }
    const {onChange} = this.props;
    if (onChange) {
      onChange(index - 1);
    }
  };
  onTextChange = event => {
    const index = Number(event.target.value);
    const {total} = this.props;
    let indexError;
    if (isNaN(index) || index > total || index < 1) {
      indexError = 'Invalid input';
    }
    this.setState({indexError, index: event.target.value});
  };
  setIndex = index => {
    const {onChange, total} = this.props;
    if (!onChange || isNaN(index) || index > total || index < 1) {
      return;
    }
    onChange(index - 1);
  }
  render() {
    const {
      total, style: containerStyle
    } = this.props;
    const {index, indexError} = this.state;
    const prevProps = {
      label: '上一个',
      icon: <PrevIcon color="rgb(0, 188, 212)" />,
      onClick: () => this.setIndex(index - 1)
    };
    const nextProps = {
      label: '下一个',
      labelPosition: 'before',
      icon: <NextIcon color="rgb(0, 188, 212)" />,
      onClick: () => this.setIndex(index + 1)
    };
    const inputProps = {
      value: index,
      style: {width: 40},
      inputStyle: {textAlign: 'center'},
      onChange: this.onTextChange,
      errorText: indexError,
      name: 'stupid-ui-lib-required',
      errorStyle: {
        position: 'absolute', top: 0, whiteSpace: 'nowrap',
        zIndex: -1
      }
    };
    const lastProps = {
      icon: <LastIcon />,
      label: '末尾',
      onClick: () => this.setIndex(total)
    };
    const formStyle = {display: 'inline-block'};
    return (
      <div style={containerStyle}>
        <FlatButton {...prevProps} />
        <form onSubmit={this.onChange} style={formStyle}>
          <TextField {...inputProps} />
        </form>
        <FlatButton {...nextProps} />
        <FlatButton {...lastProps} />
      </div>
    );
  }
}

export default Paginate;
