import { Middleware } from '@reduxjs/toolkit';
import { addRequest, removeRequest } from '../slice/spinningSlide';
// import { resetStateAction } from '../actions/resetState';

export const loadingMiddleware: Middleware = ({
  dispatch
}) => (next) => (action) => {
  if (action?.meta) {
    const { requestId, requestStatus } = action?.meta!;
    if (requestStatus === 'pending') {
      dispatch(addRequest(requestId));
    } else if (requestStatus === 'fulfilled' || requestStatus === 'rejected') {
      dispatch(removeRequest());
    }
  }
  return next(action);
};