import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {loadImage, showDetail} from '../actions';
import Image from './Image';
import Spinner from '../components/Spinner';
import chunk from 'lodash/chunk';
import {StaggeredMotion, spring, presets} from 'react-motion';

class ImageList extends React.Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    loadImage: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isFetching: PropTypes.bool.isRequired,
    apiType: PropTypes.string,
    push: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
  }
  componentWillMount() {
    const {push, loadImage} = this.props;
    const index = this.getIndex(this.props);
    if (isNaN(index)) {
      push('/0');
      return;
    }
    loadImage(index);
  }
  componentWillReceiveProps(nextProps) {
    const {push, loadImage, index: nextIndex, apiType} = nextProps;
    const {index: currIndex} = this.props;
    const nextHashIndex = this.getIndex(nextProps);
    if (isNaN(nextHashIndex)) {
      push('/0');
      return;
    }

    const currHashIndex = this.getIndex(this.props);
    if (currIndex === nextIndex && currIndex === currHashIndex && currHashIndex !== nextHashIndex) {
      // Hash changed
      return loadImage(nextHashIndex);
    } else if (apiType === 'form' && currIndex !== nextIndex &&
               nextIndex !== nextHashIndex) {
      return push(`/${nextIndex}`);
    }
  }
  getIndex(props) {
    let {match: {params: {index}}} = props;
    index = parseInt(index, 10);
    return index;
  }
  onBoxClick = (box, image) => {
    const {showDetail} = this.props;
    showDetail(image.id, box.uid);
  };
  onImageClick = image => {
    const {showDetail} = this.props;
    showDetail(image.id);
  };
  renderMain() {
    const {images} = this.props;
    const rows = chunk(images, 5);
    const imgStyle = {
      display: 'inline-block',
      margin: 4
    };
    const {onBoxClick, onImageClick} = this;
    const interpolate = prevStyles => prevStyles.map(
      (_, i) => i === 0 ? {h: spring(188, presets.gentle)} : {h: spring(prevStyles[i - 1].h)}
    );
    const gen = styles => styles.map(({h}, index) => {
      const row = rows[index];
      const images = row.map((image, index) => (
        <div key={index} style={imgStyle}>
          <Image
            divHeight={h}
            onBoxClick={onBoxClick}
            onImageClick={onImageClick} {...image}
          />
        </div>
      ));
      const listProps = {
        key: index,
        className: 'review-gallery-row',
        style: {
          textAlign: 'left'
        }
      };
      return (
        <div {...listProps}>{images}</div>
      );
    });
    const tiles = (
      <StaggeredMotion
        defaultStyles={Array.from({length: rows.length}, () => ({h: 0}))}
        styles={interpolate}
      >{styles => <div>{gen(styles)}</div>}</StaggeredMotion>
    );
    const imagesDivStyle = {
      lineHeight: 0,
      textAlign: 'center',
      display: 'inline-block'
    };
    const wrapProps = {
      style: {textAlign: 'center'},
      className: 'review-gallery-container'
    };
    return (
      <div {...wrapProps}>
        <div className="review-gallery-images" style={imagesDivStyle}>
          {tiles}</div>
      </div>
    );
  }
  render() {
    const {isFetching} = this.props;
    return isFetching ? (
      <div style={{height: 400}}>
        <Spinner />
      </div>
    ) : this.renderMain();
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    pagination: {images: {ids, index, isFetching}},
    latestAPIType: apiType
  } = state;
  const fullImages = state.entities.images;
  const images = ids.map(id => fullImages[id]);
  const {history: {push}} = ownProps;
  return {...ownProps, images, push, index, apiType, isFetching};
};

const mapDispatchToProps = dispatch => ({
  loadImage: (...args) => dispatch(loadImage(...args)),
  showDetail: (...args) => dispatch(showDetail(...args))
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageList);
