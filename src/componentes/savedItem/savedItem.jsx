import React from 'react';
import cl from './savedItem.module.css'
import Mybutton from "../mybutton/mybutton";

const SavedItem = (props) => {
    return (
        <div className={cl.savedBlock}>
            <div {...props} className={cl.saved}>
                <img src={props.src} alt="" className={cl.img}/>
            </div>
            <Mybutton style={{width: '110%'}} onClick={() => props.remove(props.id)}>Удалить</Mybutton>
        </div>
    );
};

export default SavedItem;