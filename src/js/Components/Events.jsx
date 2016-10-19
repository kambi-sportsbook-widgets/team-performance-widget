import React from 'react';

const Events = ({ children }) => {
   return (
      <div className="l-flexbox l-horizontal l-mb-20">
         <div className="l-flexbox l-flex-1 l-horizontal l-pr-16 l-pl-16">
            {children}
         </div>
      </div>
   );
};

Events.propTypes = {
   /**
    * Array of Event components
    */
   children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
};

export default Events;
