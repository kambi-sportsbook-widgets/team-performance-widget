import React from 'react';

const Detailed = ({ children }) => {
   return (
      <div className="kw-detailed">
         {children}
      </div>
   );
};

Detailed.propTypes = {
   /**
    * Inner components
    */
   children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
};

export default Detailed;
