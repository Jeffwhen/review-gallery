import fetch from 'isomorphic-fetch';
import {normalize, schema} from 'normalizr';
import jquery from 'jquery';
import pathlib from 'path';
import querystring from 'querystring';
import urllib from 'url';
import pick from 'lodash/pick';

export const CALL_API = 'Call API';
const jsonHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
};
const formHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded'
};

// Stupid API hack
const location = window.location;
const path = pathlib.basename(location.pathname);
let Endpoint = '/image';
switch (path) {
  case 'god':
  case 'qgCheck': {
    const qObj = querystring.parse(location.search.slice(1));
    qObj.voteType = 1;
    qObj.auditView = qObj.auditView || 0;
    Endpoint = `/admin/god/godEye?${querystring.stringify(qObj)}`;
    break;
  }
  case 'audit': {
    Endpoint = `/user/auditTag/tagAuditProcess${location.search}`;
    break;
  }
  default:
    break;
}
const ExtraParams = {};
const postApi = ({pageIndex, ...params}, schema, proc, type='json') => {
  if (typeof pageIndex === 'undefined') {
    throw new Error('invalid pageIndex param');
  }
  const urlobj = urllib.parse(Endpoint, true);
  urlobj.query = {...urlobj.query, pageIndex};
  const endpoint = urllib.format(pick(urlobj, ['pathname', 'query']));
  if (type === 'json') {
    params = JSON.stringify(Object.assign(params, ExtraParams));
  } else if (type === 'form') {
    params = jquery.param(params);
  } else if (type === 'get') {
    params = undefined;
  } else {
    throw new Error(`invalid post type ${type}`);
  }
  return fetch(endpoint, {
    method: type === 'get' ? 'GET' : 'POST',
    body: params, credentials: 'same-origin',
    headers: type === 'json' ? jsonHeaders : formHeaders
  }).then(
    res => res.json()
  ).then(json => {
    if (json.errcode) {
      return Promise.reject(json);
    }

    let {maxPageIndex: total, pageIndex: index} = json;
    total = parseInt(total, 10);
    index = parseInt(index, 10);
    if (index > total) {
      throw new Error(`Invalid response index: ${index} out of ${total}`);
    }
    json = proc ? proc(json) : json;
    return {...normalize(json, schema), total, index};
  });
};

const imageSchema = new schema.Entity('images', {}, {
  processStrategy: entity => {
    if (!('width' in entity && 'height' in entity)) {
      throw new Error('Lack image size info from server.');
    }
    entity.url = entity.url.replace('_300x300', '');
    entity.id = entity.unitId;
    delete entity.unitId;
    return entity;
  }
});

export const Schemas = {
  IMAGE: imageSchema
};

export default store => next => action => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let {params} = callAPI;
  const {schema, types, proc, type} = callAPI;

  if (typeof params === 'function') {
    params = params(store.getState());
  }
  if (typeof params !== 'object') {
    throw new Error('Specify a object as call api param');
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  };

  const [requestType, successType, failureType] = types;
  next(actionWith({type: requestType, apiType: type}));

  return postApi(params, schema, proc, type).then(
    response => next(actionWith({
      response, type: successType, apiType: type
    })),
    error => next(actionWith({
      error: error.message || error.errmsg || 'Something bad happened',
      level: error.errcode === 1 ? 'info' : 'error',
      type: failureType
    }))
  );
};
