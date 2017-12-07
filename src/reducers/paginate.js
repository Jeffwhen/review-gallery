const paginate = types => {
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected types to be an array of three elements.');
  }
  if (!types.every(t => typeof t === 'string')) {
    throw new Error('Expected types to be strings.');
  }

  const [requestType, successType, failureType] = types;

  return (state={
    isFetching: false,
    index: 0,
    total: null,
    ids: []
  }, action) => {
    switch (action.type) {
      case requestType:
        return {...state, isFetching: true};
      case successType:
        return {
          ...state,
          isFetching: false,
          total: action.response.total,
          ids: action.response.result,
          index: action.response.index
        };
      case failureType:
        return {
          ...state,
          isFetching: false
        };
      default:
        break;
    }

    return state;
  };
};

export default paginate;
