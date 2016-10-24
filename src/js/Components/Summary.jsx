import React from 'react';

const Summary = ({ children }) => {
   return (
      <div className="kw-summary">
         {children}
      </div>
   );
};

Summary.propTypes = {
   /**
    * Inner components
    */
   children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
};

Summary.HEIGHT = 71;

export default Summary;
