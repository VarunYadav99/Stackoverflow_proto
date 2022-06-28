import React, { useEffect, Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTags, createTag } from '../../redux/tags/tags.actions';
import handleSorting from '../../services/handleSorting';

import TagPanel from './TagPanel/TagPanel.component';
import Spinner from '../../components/Spinner/Spinner.component';
import SearchBox from '../../components/SearchBox/SearchBox.component';
import ButtonGroup from '../../components/ButtonGroup/ButtonGroup.component';
import Pagination from '../../components/Pagination/Pagination.component';

import './CreateTagPage.styles.scss';

const itemsPerPage = 12;

const CreateTagPage = ({
  getTags,
  tag: {
    tags,
    loading
  },
  createTag
}) => {
  useEffect(() => {
    getTags();
  }, [getTags]);

  const [formData, setFormData] = useState({
    tagname: '',
    description: ''
  });
  const [page, setPage] = useState(1);
  const [fetchSearch, setSearch] = useState('');
  const [sortType, setSortType] = useState('Popular');

  const handleChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
    setPage(1);
  };

  const { tagname, description } = formData;

  const onChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    createTag({ tagname, description });
    setFormData({
      tagname: '',
      description: '',
    });
  };

  const handlePaginationChange = (e, value) => setPage(value);

  return loading || tags === null ? (
    <Spinner type="page" width="75px" height="200px"/>
  ) : (
    <Fragment>
      <div id="mainbar" className="tags-page fc-black-800">

        <h1 className="headline">Tags</h1>
        <p className="fs-body">
          A tag is a keyword or label that categorizes your question with other,
          similar questions. Using the right tags makes it easier for others to
          find and answer your question.
        </p>
        <div className="post-button mt4 mb8">
          <form onSubmit={(e) => onSubmit(e)}>
            <input className="title-input s-input ml16" type="text" name="tagname"
                   value={tagname} onChange={(e) => onChange(e)}
                   id="Tag" placeholder="Enter tag name to create new one" required/>
            <input className="title-input s-input mt4 ml16" type="text" name="description"
                   value={description} onChange={(e) => onChange(e)}
                   id="description" placeholder="Enter description of tag" required/>
            <button className="s-btn s-btn__primary ml16 mt8" id="create-tag-button"
                    name="create-tag">Create
              Tag
            </button>
          </form>
        </div>
        <div className="headline-count">
          <span>{new Intl.NumberFormat('en-IN').format(tags.length)} tags</span>
        </div>
        <div className="tags-box pl16 pr16 pb16">
          <SearchBox
            placeholder={'filter by tag name'}
            handleChange={handleChange}
            width={'200px'}
          />
          <ButtonGroup
            buttons={['Popular', 'Name', 'New']}
            selected={sortType}
            setSelected={setSortType}
          />
        </div>
        <div className="user-browser">
          <div className="grid-layout">
            {tags
              .filter((tag) =>
                tag.tagname.toLowerCase()
                  .includes(fetchSearch.toLowerCase())
              )
              ?.sort(handleSorting(sortType))
              .slice((page - 1) * itemsPerPage, (page - 1) * itemsPerPage + itemsPerPage)
              .map((tag, index) => (
                <TagPanel key={index} tag={tag}/>
              ))}
          </div>
        </div>
        <Pagination
          page={page}
          itemList={tags.filter((tag) => tag.tagname.toLowerCase()
            .includes(fetchSearch.toLowerCase()))}
          itemsPerPage={itemsPerPage}
          handlePaginationChange={handlePaginationChange}
        />
      </div>
    </Fragment>
  );
};

CreateTagPage.propTypes = {
  getTags: PropTypes.func.isRequired,
  createTag: PropTypes.func.isRequired,
  tag: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  tag: state.tag,
});

export default connect(mapStateToProps, {
  getTags,
  createTag
})(CreateTagPage);
