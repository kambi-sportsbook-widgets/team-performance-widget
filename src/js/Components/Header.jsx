import React from 'react';

const Header = ({ title }) => {
   return (
      <header className="kw-header KambiWidget-card-support-text-color">{title}</header>
   );
};

Header.propTypes = {
   /**
    * Header's title
    */
   title: React.PropTypes.string
};

Header.HEIGHT = 50;

export default Header;
