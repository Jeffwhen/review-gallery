import React from 'react';
import merge from 'lodash/merge';

const Div = ({children, subStyle, ...props}) => {
  props = merge(props, {style: {
    height: '100%'
  }});
  subStyle = merge(subStyle, {
    verticalAlign: 'middle',
    display: 'inline-block',
    width: '100%'
  });
  const refStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
    height: '100%',
    width: 0
  };
  return (
    <div {...props}>
      <div style={refStyle}></div>
      <div style={subStyle}>{children}</div>
    </div>
  );
};

export default Div;
