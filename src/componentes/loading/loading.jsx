import React from 'react';
import cl from './loading.module.css'

const Loading = (props) => {
    return (
        <div className={cl.loading} {...props}></div>
    );
};

export default Loading;