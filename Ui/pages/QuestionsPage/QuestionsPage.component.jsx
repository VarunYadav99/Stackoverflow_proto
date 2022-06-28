import React, {Fragment, useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {getPosts} from '../../redux/posts/posts.actions';
import handleSorting from '../../services/handleSorting';

import LinkButton from '../../components/LinkButton/LinkButton.component';
import PostItem from '../../components/PostItem/PostItem.component';
import Spinner from '../../components/Spinner/Spinner.component';
import ButtonGroup from '../../components/ButtonGroup/ButtonGroup.component';
import SearchBox from '../../components/SearchBox/SearchBox.component';
import PageTitle from '../../components/PageTitle/PageTitle.component';
import Pagination from "../../components/Pagination/Pagination.component";

import './QuestionsPage.styles.scss';

const itemsPerPage = 10;

const QuestionsPage = ({getPosts, post: {posts, loading}}) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  posts = posts.filter((post) => post.status === 'APPROVED')
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState('Newest');

  let searchQuery = new URLSearchParams(useLocation().search).get('search');
  console.log(searchQuery)

  const handlePaginationChange = (e, value) => setPage(value);

  function ShowPosts(props) {
    var currentQuery = (searchQuery ? searchQuery : '').trim();

    let newPosts = [];
    let result = /\[(?<tagName>\w+)\]/.exec(currentQuery)

    if (currentQuery.startsWith("[") && result != null) {
      const tagName = result.groups['tagName']
      currentQuery = currentQuery.replace("[" + tagName + "]", "").trim();

      newPosts = posts.filter(
        (post) => (post.title.includes(currentQuery ? currentQuery : '') && (post.tags.find( function (tag, index) {
          if(tag.tagname === tagName) 
            return true;
        })))
      );
      // Search within tag
    } else if (currentQuery.startsWith("user:")) {
      currentQuery = currentQuery.replace("user:", "");
      var userName = currentQuery.split(" ").shift()
      currentQuery = currentQuery.replace(userName, "").trim();
      newPosts = posts.filter(
        (post) => (post.username === userName && post.title.includes(currentQuery ? currentQuery : ''))
      );
      // Search within user's posts
    } else if (currentQuery.startsWith("isaccepted:yes ") || currentQuery.startsWith("isaccepted:no ")) {
      // search within status
      currentQuery = currentQuery.replace("isaccepted:", "");
      if (currentQuery.startsWith("yes ")) {
        currentQuery = currentQuery.slice(4);
        newPosts = posts.filter(
          (post) => (post.best_answer != null && post.title.includes(currentQuery ? currentQuery : ''))
        );
      } else if (currentQuery.startsWith("no ")) {
        currentQuery = currentQuery.slice(3);
        newPosts = posts.filter(
          (post) => (post.best_answer === null && post.title.includes(currentQuery ? currentQuery : ''))
        );
      }
    } else if (currentQuery.startsWith('"') && currentQuery.endsWith('"')) {
      // search exact phrase
      currentQuery = currentQuery.slice(1, -1);
      newPosts = posts.filter((post) => post.title === (currentQuery ? currentQuery : ''));
    } else {
      // Search Normally
      newPosts = posts.filter((post) => post.title.includes(currentQuery ? currentQuery : ''));
    }
    return (
      <>
        {newPosts?.sort(handleSorting(sortType))
          .slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage)
          .map((post, index) => (
            <PostItem key={index} post={post} />
          ))}
      </>
    )
  };

  function PostCount(props) {
    var currentQuery = (searchQuery ? searchQuery : '').trim();

    let newPosts = [];
    let result = /\[(?<tagName>\w+)\]/.exec(currentQuery)

    if (currentQuery.startsWith("[") && result != null) {
      const tagName = result.groups['tagName']
      currentQuery = currentQuery.replace("[" + tagName + "]", "").trim();

      newPosts = posts.filter(
        (post) => (post.title.includes(currentQuery ? currentQuery : '') && (post.tags.find( function (tag, index) {
          if(tag.tagname === tagName) 
            return true;
        })))
      );
      // Search within tag
    } else if (currentQuery.startsWith("user:")) {
      currentQuery = currentQuery.replace("user:", "");
      var userName = currentQuery.split(" ").shift()
      currentQuery = currentQuery.replace(userName, "").trim();
      newPosts = posts.filter(
        (post) => (post.username === userName && post.title.includes(currentQuery ? currentQuery : ''))
      );
      // Search within user's posts
    } else if (currentQuery.startsWith("isaccepted:yes ") || currentQuery.startsWith("isaccepted:no ")) {
      // search within status
      currentQuery = currentQuery.replace("isaccepted:", "");
      if (currentQuery.startsWith("yes ")) {
        currentQuery = currentQuery.slice(4);
        newPosts = posts.filter(
          (post) => (post.best_answer != null && post.title.includes(currentQuery ? currentQuery : ''))
        );
      } else if (currentQuery.startsWith("no ")) {
        currentQuery = currentQuery.slice(3);
        newPosts = posts.filter(
          (post) => (post.best_answer === null && post.title.includes(currentQuery ? currentQuery : ''))
        );
      }
    } else if (currentQuery.startsWith('"') && currentQuery.endsWith('"')) {
      // search exact phrase
      currentQuery = currentQuery.slice(1, -1);
      newPosts = posts.filter((post) => post.title === (currentQuery ? currentQuery : ''));
    } else {
      // Search Normally
      newPosts = posts.filter((post) => post.title.includes(currentQuery ? currentQuery : ''));
    }
    return (
      <span>
        {newPosts.length} questions
      </span>
    )
  };

  return loading || posts === null ? (
    <Spinner type='page' width='75px' height='200px' />
  ) : (
    <Fragment>
      {searchQuery ? (
        <PageTitle
          title={`Search Results for ${searchQuery} - Stack Overflow`}
        />
      ) : (
        ''
      )}
      <div id='mainbar' className='questions-page fc-black-800'>
        <div className='questions-grid'>
          <h3 className='questions-headline'>
            {searchQuery ? 'Search Results' : 'All Questions'}
          </h3>
          <div className='questions-btn'>
            <LinkButton
              text={'Ask Question'}
              link={'/add/question'}
              type={'s-btn__primary'}
            />
          </div>
        </div>
        {searchQuery ? (
          <div className='search-questions'>
            <span style={{color: '#acb2b8', fontSize: '12px'}}>
              Results for {searchQuery}
            </span>
            <SearchBox placeholder={'Search...'} name={'search'} pt={'mt8'} />
          </div>
        ) : (
          ''
        )}
        <div className='questions-tabs'>
          <PostCount />
          <ButtonGroup
            buttons={['Newest', 'Top', 'Views', 'Oldest']}
            selected={sortType}
            setSelected={setSortType}
          />
        </div>
        <div className='questions'>
          <ShowPosts/>
        </div>
        <Pagination
          page={page}
          itemList={posts.filter((post) => post.title.toLowerCase().includes(searchQuery ? searchQuery : ''))}
          itemsPerPage={itemsPerPage}
          handlePaginationChange={handlePaginationChange}
        />
      </div>
    </Fragment>
  );
};

QuestionsPage.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, {getPosts})(QuestionsPage);
