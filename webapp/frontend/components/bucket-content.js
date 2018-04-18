import React from 'react';
import BucketContentItem from './bucket-content-item'


const BucketContent = (props) => {
    const content = props.items.map(item => {
        return (<BucketContentItem key={item.name} {...item} apiRoot={props.apiRoot}/>)
    });
    return (
        <div>
            {content}
        </div>
    )
}

export default BucketContent;