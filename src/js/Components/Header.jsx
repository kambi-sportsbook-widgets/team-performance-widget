import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ title }) => {
   return (
      <header className='kw-header KambiWidget-card-support-text-color'>{title}</header>
   );
};

Header.propTypes = {
   /**
    * Header's title
    */
   title: PropTypes.string
};

export default Header;
