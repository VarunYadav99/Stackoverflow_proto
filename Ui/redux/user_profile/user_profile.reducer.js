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

const initialState = {
  posts: [],
  post_loading: true,
  tags: [],
  tag_loading: true,
  answers: [],
  answer_loading: true,
  badges: [],
  badge_loading: true,
  user: null,
  user_loading: true,
  error: {},
};

export default function user_profile(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        post_loading: false,
      };
    case GET_ANSWERS:
    case GET_BADGE:
    case GET_TAGS:
        return {
            ...state,
            tags: action.payload,
            tag_loading: false,
          };
    case GET_USER:
    case ANSWERS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case BADGE_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case POST_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case TAG_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case USER_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
