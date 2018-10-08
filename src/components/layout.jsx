import React from 'react';
import PropTypes from 'prop-types';
import '../global-styles';
import userConfig from '../../config';

import Header from '../components/Header';

class Layout extends React.Component {
  render() {
    const { location, children } = this.props;
    return (
      <div>
        <Header config={userConfig}/>
        {children}
      </div>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.func,
  location: PropTypes.object,
  route: PropTypes.object,
};

export default Layout
