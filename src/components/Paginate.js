import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import NextIcon from 'material-ui/svg-icons/image/navigate-next';
import PrevIcon from 'material-ui/svg-icons/image/navigate-before';
import FirstIcon from 'material-ui/svg-icons/navigation/first-page';
import LastIcon from 'material-ui/svg-icons/navigation/last-page';

import './Paginate.css';

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
    const {onChange, total, index: currIndex} = this.props;
    if (!onChange || isNaN(index) || index > total || index < 1) {
      return;
    }
    index -= 1;
    if (index === currIndex) {
      return;
    }
    onChange(index);
  }
  render() {
    const {
      total, style: containerStyle, index: forReal
    } = this.props;
    const {index, indexError} = this.state;
    const firstProps = {
      icon: <FirstIcon />,
      label: '开始',
      onClick: () => this.setIndex(1),
      labelPosition: 'before',
      className: 'secondary-paginate'
    };
    const prevProps = {
      label: '上一个',
      icon: <PrevIcon color="rgb(0, 188, 212)" />,
      onClick: () => this.setIndex(forReal)
    };
    const nextProps = {
      label: '下一个',
      labelPosition: 'before',
      icon: <NextIcon color="rgb(0, 188, 212)" />,
      onClick: () => this.setIndex(forReal + 2)
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
    const totalProps = {
      ...inputProps,
      value: total,
      underlineShow: false,
      onMouseDown: ev => {ev.preventDefault(); ev.target.blur();}
    };
    const lastProps = {
      icon: <LastIcon />,
      label: '末尾',
      onClick: () => this.setIndex(total),
      className: 'secondary-paginate'
    };
    const formStyle = {display: 'inline-block'};
    return (
      <div style={containerStyle}>
        <FlatButton {...firstProps} />
        <FlatButton {...prevProps} />
        <form onSubmit={this.onChange} style={formStyle}>
          <TextField {...inputProps} /> /
          <TextField {...totalProps} />
          <button style={{display: 'none'}} type="submit" />
        </form>
        <FlatButton {...nextProps} />
        <FlatButton {...lastProps} />
      </div>
    );
  }
}

export default Paginate;
