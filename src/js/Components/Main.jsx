import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';

const Main = ({ title, children }) => {
   return (
      <main className='kw-main'>
         <Header title={title} />
         {children}
      </main>
   );
};
Main.propTypes = {
   /**
    * Widget's title
    */
   title: PropTypes.string.isRequired,
   /**
    * Inner components
    */
   children: PropTypes.node.isRequired
};
export default Main;
