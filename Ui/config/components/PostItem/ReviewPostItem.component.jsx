import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import htmlSubstring from '../../services/htmlSubstring'
import injectEllipsis from '../../services/injectEllipsis'

import UserCard from '../UserCard/UserCard.component';
import TagBadge from '../TagBadge/TagBadge.component';

import './PostItem.styles.scss';
import BaseButton from '../BaseButton/BaseButton.component';
import { updatePost } from '../../redux/posts/posts.actions';

const ReviewPostItem = ({updatePost,
  post: {
    id,
    title,
    body,
    images,
    username,
    gravatar,
    user_id,
    answer_count,
    comment_count,
    views,
    created_at,
    tags,
  },
}) => {
  body = body.replaceAll("&lt;", "<")
  const answerVoteUp = (
    <div className='vote answer'>
      <span className='vote-count fc-green-500'>{answer_count}</span>
      <div className='count-text'>answers</div>
    </div>
  );

  const answerVoteDown = (
    <div className='vote'>
      <span className='vote-count'>{answer_count}</span>
      <div className='count-text'>answers</div>
    </div>
  );
  const updatePostHandler = (id, status) => updatePost(id, {status})

  return (
    <div className='posts'>
      <div className='stats-container fc-black-500'>
        <div className='stats'>
          <div className='vote'>
            <span className='vote-count'>{comment_count}</span>
            <div className='count-text'>comments</div>
          </div>
          {answer_count > 0 ? answerVoteUp : answerVoteDown}
          <div className='vote'>
            <span className='vote-count'>{tags.length}</span>
            <div className='count-text'>tags</div>
          </div>
          <div className='vote'>
            <div className='count-text'>{views} views</div>
          </div>
        </div>
      </div>
      <div className='summary'>
        <h3>
          <Link to={`/questions/${id}`}>{title}</Link>
        </h3>

        <div className='brief' dangerouslySetInnerHTML={{__html: injectEllipsis(htmlSubstring(body, 200))}}></div>
        <img src={images} alt=""/>
        {tags.map((tag, index) => (
          <TagBadge key={index} tag_name={tag.tagname} size={'s-tag'} float={'left'} />
        ))}
        <div className='p24'>
          <div className='grid--cell'>
            <div className=' grid s-btn-group js-filter-btn'>
                <BaseButton text='Approve' onClick={() => updatePostHandler(id, 'APPROVED')}/>
                <BaseButton text='Reject' onClick={() => updatePostHandler(id, 'REJECTED')}/>
              ))}
            </div>
          </div>
          <UserCard
            created_at={created_at}
            user_id={user_id}
            gravatar={gravatar}
            username={username}
            float={'right'}
            backgroundColor={'transparent'}
          />
        </div>

      </div>
    </div>
  );
};

ReviewPostItem.propTypes = {
  updatePost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

// const mapStateToProps = (state) => ({
//   post: state.post,
// });

export default connect(null, {updatePost})(ReviewPostItem);
