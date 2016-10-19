import React from 'react';

const MatchResultIndicatorList = (props) => {
   return (
      <div className="l-flexbox l-horizontal l-mb-20">
         <div className="l-flexbox l-flex-1 l-horizontal l-pr-16 l-pl-16">
            { props.children }
         </div>
      </div>
   );
};

MatchResultIndicatorList.propTypes = {
   /**
    * Array of Event components
    */
   children: React.PropTypes.arrayOf(React.PropTypes.element).isRequired
};

export default MatchResultIndicatorList;
