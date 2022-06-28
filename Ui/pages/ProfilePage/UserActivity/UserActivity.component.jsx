import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getPosts, getTags } from "../../../redux/user_profile/user_profile.actions";

import TagBadge from "../../../components/TagBadge/TagBadge.component";

import "./UserActivity.styles.scss";
import Spinner from "../../../components/Spinner/Spinner.component";
import PostItem from "../../../components/PostItem/PostItem.component";
import Pagination from "../../../components/Pagination/Pagination.component";
import LinkButton from "../../../components/LinkButton/LinkButton.component";
import ButtonGroup from "../../../components/ButtonGroup/ButtonGroup.component";
import handleSorting from "../../../services/handleSorting";

const itemsPerPage = 2;

const UserActivity = ({
  getPosts,
  getTags,
  user: { user, user_loading },
  post: { posts, post_loading },
  tag: { tags, tag_loading }, 
}) => {
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  useEffect(() => {
    getTags(user.username);
  }, [getTags]);

  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState("Newest");

  const handlePaginationChange = (e, value) => setPage(value);

  console.log(user, posts);

  return (
    <>
      {user_loading || posts === null ? (
        <Spinner type="page" width="75px" height="200px" />
      ) : (
        <Fragment>
          <div className="questions-tabs">
            <span>
              {new Intl.NumberFormat("en-IN").format(posts.length)} questions
            </span>
            <ButtonGroup
              buttons={["Newest", "Top", "Views", "Oldest"]}
              selected={sortType}
              setSelected={setSortType}
            />
          </div>
          <div className="questions">
            {posts
              ?.sort(handleSorting(sortType))
              .slice(
                (page - 1) * itemsPerPage,
                (page - 1) * itemsPerPage + itemsPerPage
              )
              .map((post, index) => (
                <PostItem key={index} post={post} />
              ))}
          </div>
          <Pagination
            page={page}
            itemList={posts}
            itemsPerPage={itemsPerPage}
            handlePaginationChange={handlePaginationChange}
          />
        </Fragment>
      )}
    </>
  );
};

UserActivity.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  user: state.user,
  tag: state.tag,
});

export default connect(mapStateToProps, { getPosts, getTags })(UserActivity);