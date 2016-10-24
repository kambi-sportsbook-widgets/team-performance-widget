import React from 'react';

const Main = ({ children, defaultExpanded, expandHandler }) => {
   const onChangeHandler = (event) => {
      if (expandHandler) {
         expandHandler(event.target.checked);
      }
   };

   return (
      <main className="kw-main">
         <input className="kw-accordion" type="checkbox" defaultChecked={defaultExpanded} onChange={onChangeHandler} />
         {children}
      </main>
   );
};

Main.propTypes = {
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
