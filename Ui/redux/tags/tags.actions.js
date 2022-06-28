import { GET_TAG, GET_TAGS, CREATE_TAG, TAG_ERROR } from './tags.types';
import axios from 'axios';
import { setAlert } from '../alert/alert.actions';
import config from '../../config';

export const getTag = (tagName) => async (dispatch) => {
  try {
    const res = await axios.get(config.BASE_URL + `/api/tags/${tagName}`);

    dispatch({
      type: GET_TAG,
      payload: res.data.data,
    });
  } catch (err) {
    // dispatch(() => history.push('/questions'))
    dispatch(setAlert(err.response.data.message, 'danger'));

    dispatch({
      type: TAG_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      },
    });
  }
};

export const getTags = () => async (dispatch) => {
  try {
    const res = await axios.get(config.BASE_URL + '/api/tags');

    dispatch({
      type: GET_TAGS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch(setAlert(err.response.data.message, 'danger'));

    dispatch({
      type: TAG_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      },
    });
  }
};

export const createTag = (formData) => async (dispatch) => {
  const configHeaders = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post(config.BASE_URL + '/api/tags/create', formData, configHeaders);

    dispatch({
      type: CREATE_TAG,
      payload: res.data.data,
    });
    dispatch(setAlert(res.data.message, 'success'));
  } catch (err) {
    if (err.response.status === 422) {
      console.log(err.response.data.errors);
      for (let i = 0; i < err.response.data.errors.length; i++) {
        console.log(err.response.data.errors[i].msg)
        dispatch(setAlert(err.response.data.errors[i].msg, 'danger'));
      }
    } else {
      dispatch(setAlert(err.response.data.message, 'danger'));
    }

    dispatch({
      type: TAG_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      },
    });
  }
};
