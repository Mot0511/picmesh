import React from 'react';
import cl from './mybutton.module.css'

const Mybutton = (props) => {
    return (
        <button className={cl.button} {...props}>{props.children}</button>
    );
};

export default Mybutton;