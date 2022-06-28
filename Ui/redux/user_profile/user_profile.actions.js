import axios from 'axios';

import config from "../../config";
import {setAlert} from '../alert/alert.actions';
import {
    GET_POSTS,
    ANSWERS_ERROR,
    BADGE_ERROR,
    GET_ANSWERS,
    GET_BADGE,
    GET_TAGS,
    GET_USER,
    POST_ERROR,
    TAG_ERROR,
    USER_ERROR,
} from "./user_profile.types";

// Get posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get(config.BASE_URL + '/api/posts');

    dispatch({
      type: GET_POSTS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch(setAlert(err.response.data.message, 'danger'));

    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status},
    });
  }
};

//GET TAG POSTS
export const getTags = (userName) => async (dispatch) => {
  try {
    const res = await axios.get(config.BASE_URL + `/api/posts/tag/${userName}`);

    dispatch({
      type: GET_TAGS,
      payload: res.data.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {msg: err.response.statusText, status: err.response.status},
    });
  }
};
