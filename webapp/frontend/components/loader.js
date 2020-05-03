import React from 'react';

const Loader = () => {
    return (
        <div className='text-center' style={{ paddingTop: '40px' }}>
            <p><i className='fa fa-cog fa-spin' style={{ fontSize: '32px' }}></i></p>
            <p>Loading...</p>
        </div>
    );
};

export default Loader;

