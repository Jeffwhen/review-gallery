import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ImageView, {
  calcScaleBox, adjustBox, genURL
} from '../components/Image';
import VerticalCenterDiv from '../components/VerticalCenterDiv';
import {changeImage} from '../actions';

import NonCheckIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckIcon from 'material-ui/svg-icons/toggle/check-box';
import EditIcon from 'material-ui/svg-icons/image/edit';

const bggradient = 'linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 70%, rgba(0, 0, 0, 0) 100%)';
const size = {width: 240, height: 188};
class Image extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    updateUrl: PropTypes.string.isRequired,
    check: PropTypes.number.isRequired,
    divHeight: PropTypes.number,
    checkImage: PropTypes.func
  }
  state = {check: this.props.check}
  checkImage = () => {
    let {check} = this.props;
    check = check === 0 ? 1 : 0;
    const {checkImage, id} = this.props;
    if (checkImage) {
      checkImage(id, check);
    }
  }
  wrap(elem) {
    const captionProps = {
      className: 'review-gallery-caption',
      style: {
        position: 'absolute',
        bottom: 0,
        zIndex: 2,
        background: bggradient,
        width: '100%',
        height: 68
      }
    };
    const iconProps = {
      style: {margin: '0 20px'},
      color: 'rgb(0, 188, 212)',
      cursor: 'pointer'
    };
    const {check, updateUrl, divHeight=size.height} = this.props;
    const Check = check === 0 ? NonCheckIcon : CheckIcon;
    const editAProps = {
      style: {float: 'right'},
      target: '_blank',
      href: updateUrl
    };
    const caption = (
      <VerticalCenterDiv>
        <Check onClick={this.checkImage} {...iconProps} />
        <a {...editAProps}><EditIcon {...iconProps} /></a>
      </VerticalCenterDiv>
    );
    const divStyle = {
      display: 'inline-block', ...size,
      height: divHeight,
      textAlign: 'left',
      position: 'relative'
    };
    return (
      <div style={divStyle}>
        {elem}
        <div {...captionProps}>{caption}</div>
      </div>
    );
  }
  render() {
    return this.wrap(<ImageView {...this.props} />);
  }
}

const mapStateToProps = (state, ownProps) => {
  let {url, objs} = ownProps;
  const scaleBox = calcScaleBox(ownProps, size);
  url = genURL(url, scaleBox);
  objs = JSON.parse(JSON.stringify(objs));
  objs.forEach(obj => obj.bndBoxes.forEach(box => {
    Object.assign(box, adjustBox(box, scaleBox));
  }));
  return {...ownProps, url, objs};
};

const mapDispatchToProps = dispatch => ({
  checkImage: (id, check) => dispatch(changeImage(id, {check}))
});

export default connect(mapStateToProps, mapDispatchToProps)(Image);
