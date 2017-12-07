import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {closeDetail} from '../actions';
import ImageView, {
  calcScaleBox, adjustBox, genURL
} from '../components/Image';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class DetailDialog extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    focus: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    size: PropTypes.object
  }
  close = () => {
    this.props.close();
  }
  render() {
    const {open, focus, size, ...imageProps} = this.props;
    if (!focus) {
      imageProps.showLabel = false;
    }
    const actions = (
      <FlatButton primary={true} label="确定" onClick={this.close} />
    );
    const divStyle = {...size};
    const props = {
      actions, open,
      title: '详情', modal: false,
      onRequestClose: this.close
    };
    return (
      <Dialog {...props}>
        <div style={divStyle}>
          {open ? <ImageView {...imageProps} /> : null}
        </div>
      </Dialog>
    );
  }
}

const size = {width: 400, height: 328};
const mapStateToProps = (state, ownProps) => {
  const {entities: {images}, detail: {imgId, boxId}} = state;
  const open = !!imgId;
  let image;
  if (!open) {
    return {open, focus: false};
  }
  image = JSON.parse(JSON.stringify(images[imgId]));
  let {objs, url, width, height} = image;
  console.assert(width, 'lack image width');
  console.assert(height, 'lack image height');
  let newSize = size;
  let scaleBox = {xmin: 0, ymin: 0, xmax: 1, ymax: 1};
  if (boxId) {
    objs.forEach(obj => {
      obj.bndBoxes = obj.bndBoxes.filter(box => box.uid === boxId);
    });
    objs = objs.filter(obj => obj.bndBoxes.length);
    scaleBox = calcScaleBox(image, size);
    url = genURL(url, scaleBox);
  } else {
    newSize = {
      height: size.height,
      width: size.height / height * width
    };
  }
  objs.forEach(obj => obj.bndBoxes.forEach(box => {
    Object.assign(box, adjustBox(box, scaleBox));
  }));
  return {
    ...ownProps, ...image, objs, url,
    open, size: newSize, focus: !!boxId
  };
};

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(closeDetail())
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailDialog);
