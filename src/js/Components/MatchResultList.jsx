import React from 'react';

const MatchResultList = ({ children }) => {
   return (
      <div className="overflow">
         <div className="l-flexbox l-vertical l-pack-center kw-detail l-pb-20">
            <div className="l-flexbox l-vertical kw-table">
               { children }
            </div>
         </div>
      </div>
   );
};

MatchResultList.propTypes = {
   /**
    * Array of DetailedEvent componenets
    */
   children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
};

export default MatchResultList;
