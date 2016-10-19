import React from 'react';

const DetailedEvents = ({ children }) => {
   return (
      <div className="overflow">
         <div className="l-flexbox l-vertical l-pack-center kw-detail l-pb-20">
            <div className="l-flexbox l-vertical kw-table">
               {children}
            </div>
         </div>
      </div>
   );
};

DetailedEvents.propTypes = {
   /**
    * Array of DetailedEvent componenets
    */
   children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
};

export default DetailedEvents;
