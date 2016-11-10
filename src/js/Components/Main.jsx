import React from 'react';
import Header from './Header';

const Main = ({ title, children, defaultExpanded, expandHandler }) => {
   const onChangeHandler = (event) => {
      if (expandHandler) {
         expandHandler(event.target.checked);
      }
   };

   return (
      <main className="kw-main">
         <Header title={title} />
         <input className="kw-accordion" type="checkbox" defaultChecked={defaultExpanded} onChange={onChangeHandler} />
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
   children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,

   /**
    * Should details be expanded on the beginning
    */
   defaultExpanded: React.PropTypes.bool,

   /**
    * Called on expand click, gets one 'currentState' argument
    */
   expandHandler: React.PropTypes.func
};

Main.defaultProps = {
   defaultExpanded: false
};

export default Main;
