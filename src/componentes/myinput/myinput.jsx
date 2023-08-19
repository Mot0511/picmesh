import React from 'react';
import cl from './myinput.module.css'

const Myinput = (props) => {
    return (
        <input type="text" className={cl.input} {...props} placeholder={props.text}/>

    );
};

export default Myinput;