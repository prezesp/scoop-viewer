import React from 'react';
import BucketContentItem from './bucket-content-item';
import PropTypes from 'prop-types';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const Row = props => {
    const { data, index, style } = props;
    const item = data.items[index];
    return (<div style={style}>
        <BucketContentItem key={item.name} {...item} apiRoot={data.apiRoot}/>
    </div>);
};

Row.propTypes = {
    data: PropTypes.shape({
        items: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string
        })),
        apiRoot: PropTypes.string
    }),
};


const BucketContent = (props) => {
    return (
        <div style={{ 'min-height': '88vh', 'margin': '0 -15px'}}>
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        className='List'
                        height={height}
                        itemCount={props.items.length}
                        itemSize={146}
                        itemData={props}
                        width={width}>
                        {Row}
                    </List>
                )}
            </AutoSizer>
        </div>
    );
};

BucketContent.propTypes = {
    apiRoot: PropTypes.string,
    items: PropTypes.array
};

export default BucketContent;
