import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import urllib from 'url';

import './Image.css';

const dotWidth = 4;
const labelPadding = 4;
const langMap = {
  'left_up': '左上',
  'right_up': '右上',
  'left_low': '左下',
  'right_low': '右下'
};
const ImageView = ({
  onBoxClick, onImageClick, labelFont, showLabel=true, ...image
}) => {
  let {url, objs, id} = image;
  const boxes = objs.reduce(
    (acc, obj) => acc.concat(
      obj.bndBoxes.reduce((acc, l) => acc.concat(l))
    ), []
  ).map((box, index) => {
    let {xmin, xmax, ymin, ymax, keypoints} = box;
    const style = {
      width: '100%', height: '100%',
      position: 'absolute', top: 0, left: 0
    };
    const boxStyle = {
      left: `${xmin * 100}%`,
      top: `${ymin * 100}%`,
      width: `${(xmax - xmin) * 100}%`,
      height: `${(ymax - ymin) * 100}%`,
      position: 'absolute',
      display: 'inline-block',
      cursor: 'pointer',
      zIndex: 1
    };
    keypoints = keypoints.reduce(
      (acc, d) => acc.concat(Object.keys(d).map(k => [k, d[k]])),
      []
    );
    const dots = keypoints.map(([k, cood], index) => {
      const props = {
        className: 'review-gallery-dot',
        style: {
          left: `${cood[0] * 100}%`,
          top: `${cood[1] * 100}%`,
          width: dotWidth,
          height: dotWidth,
          display: 'inline-block',
          backgroundColor: 'red',
          position: 'absolute',
          zIndex: 2
        }
      };
      let labelStyle = {
        fontSize: labelFont || '12px',
        position: 'absolute',
        top: `${cood[1] * 100}%`,
        color: 'red',
        zIndex: 2
      };
      if (cood[0] > 0.5) {
        labelStyle = {
          ...labelStyle,
          right: `${(1 - cood[0]) * 100}%`,
          paddingRight: labelPadding
        };
      } else {
        labelStyle = {
          ...labelStyle,
          left: `${cood[0] * 100}%`,
          paddingLeft: `${dotWidth + labelPadding}px`
        };
      }
      const labelProps = {
        className: 'review-gallery-dot-label',
        style: labelStyle
      };
      return (
        <div key={index}>
          <div {...props}></div>
          {showLabel ? <div {...labelProps}>{langMap[k] || k}</div> : null}
        </div>
      );
    });
    const boxClick = onBoxClick && (() => onBoxClick(box, image));
    return (
      <div key={index} style={style} className="review-gallery-box">
        <div onClick={boxClick} style={boxStyle}></div>
        {dots}
      </div>
    );
  });

  const imgStyle = {
    height: '100%', width: '100%',
    position: 'absolute',
    cursor: 'pointer'
  };
  const divStyle = {
    height: '100%', width: '100%',
    position: 'relative'
  };
  const imageClick = onImageClick && (() => onImageClick(image));
  return (
    <div style={divStyle}>
      {boxes}
      <img alt={id} onClick={imageClick} style={imgStyle} src={url}></img>
    </div>
  );
};
ImageView.propTypes = {
  url: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  objs: PropTypes.array.isRequired,
  showLabel: PropTypes.bool,
  labelFont: PropTypes.number,
  onBoxClick: PropTypes.func,
  onImageClick: PropTypes.func
};

export default ImageView;

export const propnize = v => {
  if (v < 0) {
    return 0;
  } else if (v > 1) {
    return 1;
  }
  return v;
};
export const pad = (min, max, padding) => {
  let {backward=0, forward=0} = typeof padding !== 'number' ? padding : {};
  if (typeof padding === 'number') {
    backward = forward = padding;
  }

  let backwardDebt = 0;
  if (min - backward < 0) {
    backwardDebt = backward - min;
    min = 0;
  } else {
    min -= backward;
  }

  let forwardDebt = 0;
  if (max + forward > 1) {
    forwardDebt = forward + max - 1;
    max = 1;
  } else {
    max += forward;
  }

  if (forwardDebt > min) {
    min = 0;
  } else {
    min -= forwardDebt;
  }

  if (backwardDebt + max > 1) {
    max = 1;
  } else {
    max += backwardDebt;
  }

  return [min, max];
};

const scalePadding = 0.3;
export const calcScaleBox = (image, size, bottomPadding) => {
  const {width: imgWidth, height: imgHeight} = image;

  const boxes = image.objs.reduce(
    (acc, obj) => acc.concat(
      obj.bndBoxes.reduce((acc, l) => acc.concat(l))
    ), []
  );
  let xmin = Math.min(...boxes.map(b => b.xmin));
  let ymin = Math.min(...boxes.map(b => b.ymin));
  let xmax = Math.max(...boxes.map(b => b.xmax));
  let ymax = Math.max(...boxes.map(b => b.ymax));
  const xPadding = (xmax - xmin) * scalePadding / 2;
  const yPadding = (ymax - ymin) * scalePadding / 2;

  xmin = propnize(xmin - xPadding);
  ymin = propnize(ymin - yPadding);
  xmax = propnize(xmax + xPadding);
  ymax = propnize(ymax + yPadding);

  if (bottomPadding) {
    [ymin, ymax] = pad(ymin, ymax, {forward: bottomPadding});
  }

  const width = (xmax - xmin) * imgWidth;
  const height = (ymax - ymin) * imgHeight;
  const ratio = size.width / size.height;
  if (width / height > ratio) {
    const propHeight = width / ratio;
    const padding = (propHeight - height) / imgHeight / 2;
    [ymin, ymax] = pad(ymin, ymax, padding);
  } else {
    const propWidth = height * ratio;
    const padding = (propWidth - width) / imgWidth / 2;
    [xmin, xmax] = pad(xmin, xmax, padding);
  }

  return {xmin, ymin, xmax, ymax};
};
export const adjustBox = (box, scaleBox) => {
  const xProp = scaleBox.xmax - scaleBox.xmin;
  const yProp = scaleBox.ymax - scaleBox.ymin;
  const newBox = {};
  ['xmin', 'xmax'].forEach(k => {
    newBox[k] = propnize(box[k] - scaleBox.xmin) / xProp;
  });
  ['ymin', 'ymax'].forEach(k => {
    newBox[k] = propnize(box[k] - scaleBox.ymin) / yProp;
  });
  if ('keypoints' in box) {
    newBox.keypoints = box.keypoints.map(points => {
      const newPoints = {};
      Object.keys(omit(points, 'key_name')).forEach(k => {
        const [x, y] = points[k].split(',').map(d => Number(d));
        if (x === -1 || y === -1) {
          return;
        }
        newPoints[k] = [
          (x - scaleBox.xmin) / xProp,
          (y - scaleBox.ymin) / yProp,
        ];
      });
      return newPoints;
    });
  }
  return newBox;
};
const CutAPI = 'http://its.adkalava.com/admin/imgCut';
export const genURL = (url, scaleBox) => {
  const obj = urllib.parse(CutAPI);
  obj.query = {
    x: scaleBox.xmin,
    y: scaleBox.ymin,
    w: scaleBox.xmax - scaleBox.xmin,
    h: scaleBox.ymax - scaleBox.ymin,
    url
  };
  return urllib.format(obj);
};
