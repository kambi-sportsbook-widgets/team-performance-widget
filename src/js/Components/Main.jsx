import React from 'react';
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
   title: React.PropTypes.string.isRequired,
   /**
    * Inner components
    */
   children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
};
export default Main;
