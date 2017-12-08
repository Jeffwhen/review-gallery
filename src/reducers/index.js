import * as ActionTypes from '../actions';
import merge from 'lodash/merge';
import {combineReducers} from 'redux';
import paginate from './paginate';

const entities = (state={images: {}}, action) => {
  if (action.response && action.response.entities) {
    return merge({}, state, action.response.entities);
  }

  return state;
};

const defaultError = {level: null, message: null};
const errorMessage = (state=defaultError, action) => {
  const {level, error, type} = action;
  if (type === ActionTypes.RESET_ERROR_MESSAGE) {
    return defaultError;
  } else if (error) {
    return {level, message: error};
  }

  return state;
};

const pagination = combineReducers({
  images: paginate([
    ActionTypes.IMAGE_REQUEST,
    ActionTypes.IMAGE_SUCCESS,
    ActionTypes.IMAGE_FAILURE
  ])
});

const detail = (state={imgId: null, boxId: null}, action) => {
  const {type, imgId, boxId} = action;
  if (type === ActionTypes.SHOW_DETAIL) {
    return {imgId, boxId};
  } else if (type === ActionTypes.CLOSE_DETAIL) {
    return {imgId: null, boxId: null};
  }
  return state;
};

const latestAPIType = (state=null, action) => {
  const {type, apiType} = action;
  if (type === ActionTypes.IMAGE_REQUEST) {
    return apiType;
  }
  return state;
};

const judege = (state=true, action) => {
  const {type, response: {
    result, entities: {images}={}
  }={}} = action;
  if (type === ActionTypes.IMAGE_SUCCESS) {
    return result.map(id => images[id]).every(image => 'check' in image);
  }
  return state;
};

const rootReducer = combineReducers({
  entities, errorMessage, pagination, detail, latestAPIType, judege
});

export default rootReducer;
