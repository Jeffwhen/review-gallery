import {CALL_API, Schemas} from '../middleware/api';

export const IMAGE_REQUEST = 'IMAGE_REQUEST';
export const IMAGE_SUCCESS = 'IMAGE_SUCCESS';
export const IMAGE_FAILURE = 'IMAGE_FAILURE';
export const IMAGE_UPDATE = 'IMAGE_UPDATE';

const updateImage = (id, content) => ({
  type: IMAGE_UPDATE,
  response: {entities: {images: {[id]: content}}}
});

export const changeImage = (...args) => (dispatch, getState) => {
  const {pagination} = getState();
  const isFetching = pagination.images.isFetching;
  if (isFetching) {
    return;
  }
  return dispatch(updateImage(...args));
};

export const adverseCheck = () => (dispatch, getState) => {
  const {pagination: {images: {ids}}, entities: {images}} = getState();
  const checks = ids.map(id => images[id]).map(
    ({check}) => ({check: check === 0 ? 1 : 0})
  );
  const newImages = {};
  ids.forEach((id, index) => {
    newImages[id] = checks[index];
  });
  return dispatch({
    type: IMAGE_UPDATE,
    response: {entities: {images: newImages}}
  });
};

const fetchImage = (params, type) => ({
  [CALL_API]: {
    types: [IMAGE_REQUEST, IMAGE_SUCCESS, IMAGE_FAILURE],
    type,
    params,
    schema: [Schemas.IMAGE],
    proc: d => d.images
  }
});

export const submitChecks = () => (dispatch, getState) => {
  const {
    pagination: {images: {isFetching, ids, index}},
    entities: {images}
  } = getState();
  if (isFetching) {
    return;
  }
  const imgs = ids.map(id => images[id]).map(image => ({
    unitId: image.id, status: image.check
  }));
  return dispatch(fetchImage({imgs, pageIndex: index}, 'form'));
};

export const loadImage = index => (dispatch, getState) => {
  const {pagination: {images: {isFetching}}} = getState();
  if (isFetching) {
    return;
  }
  return dispatch(fetchImage({pageIndex: index}, 'get'));
};

export const RESET_ERROR_MESSAGE = 'RESET_ERROR_MESSAGE';
export const resetErrorMessage = () => ({
  type: RESET_ERROR_MESSAGE
});

export const SHOW_DETAIL = 'SHOW_DETAIL';
export const CLOSE_DETAIL = 'CLOSE_DETAIL';
export const showDetail = (imgId, boxId) => ({
  type: SHOW_DETAIL,
  imgId, boxId
});

export const closeDetail = () => ({
  type: CLOSE_DETAIL
});
