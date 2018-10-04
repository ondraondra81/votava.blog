import React from 'react';
import PropTypes from 'prop-types';
import '../prism-js-template';
import '../global-styles';
import userConfig from '../../config';

import Header from '../components/Header';

class Template extends React.Component {
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

Template.propTypes = {
  children: PropTypes.func,
  location: PropTypes.object,
  route: PropTypes.object,
};

export default Template
