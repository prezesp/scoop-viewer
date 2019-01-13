import React from 'react';
import BucketContentItem from './bucket-content-item';
import PropTypes from 'prop-types';

const BucketContent = (props) => {
    const content = props.items.map(item => {
        return (<BucketContentItem key={item.name} {...item} apiRoot={props.apiRoot}/>);
    });
    return (
        <div>
            {content}
        </div>
    );
};

BucketContent.propTypes = {
    apiRoot: PropTypes.string,
    items: PropTypes.array
};

export default BucketContent;
