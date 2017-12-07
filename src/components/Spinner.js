import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const style = {
  textAlign: 'center',
  position: 'relative',
  width: '100%',
  height: '100%'
};
const cpStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  margin: 'auto'
};
const Spinner = () => (
  <div style={style}><CircularProgress style={cpStyle} /></div>
);

export default Spinner;
