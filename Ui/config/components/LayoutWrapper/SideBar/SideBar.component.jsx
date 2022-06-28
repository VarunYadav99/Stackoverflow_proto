import React, { Fragment } from 'react';

import SideBarItem from './SideBarItem.component';
import { SideBarData, SideBarAdminData } from './SideBarData';

import './SideBar.styles.scss';
import Spinner from '../../Spinner/Spinner.component';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const SideBar = ({auth}) => {
  return auth.loading ? (
    <Spinner type="page" width="75px" height="200px"/>
  ) : (
    <Fragment>
      <div className="side-bar-container">
        <div className="side-bar-tabs">
          <SideBarItem isHome={true} link="/" text="Home"/>

          <div className="public-tabs">
            <p className="title fc-light">PUBLIC</p>
            {SideBarData.map(({
              link,
              icon,
              text
            }, index) => (
              <SideBarItem
                key={index}
                link={link}
                icon={icon}
                text={text}
              />
            ))}
          </div>
          {auth.user?.is_admin ?
            <div className="public-tabs">
              <p className="title fc-light">Admin</p>
              {SideBarAdminData.map(({
                link,
                icon,
                text
              }, index) => (
                <SideBarItem
                  key={index}
                  link={link}
                  icon={icon}
                  text={text}
                />
              ))}
            </div> : null }
        </div>
      </div>
    </Fragment>
  );

};

SideBar.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, null)(SideBar);
