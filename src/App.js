import React, {useEffect, useState} from 'react';
import cl from './App.module.css'
import Mybutton from "./componentes/mybutton/mybutton";
import getApp from "./js/getApp";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const App = () => {
    const app = getApp()
    const db = getFirestore(app)
    const [img, setImg] = useState('')

    const getImg = (id) => {

    }
    const getId = () => {
        let id

        getImg(id)
    }
    const like = () => {

        getId()
    }
    const dislike = () => {

        getId()
    }

    return (
        <div className={cl.container}>
            <div className={cl.content}>
                <div className={cl.image} style={{backgroundImage: `url(${img})`}}>

                </div>
                <div className={cl.controls}>
                    <div className={cl.buttons}>
                        <Mybutton onClick={dislike}>Не нравится</Mybutton>
                        <Mybutton onClick={like}>Нравится</Mybutton>
                        <Mybutton>Пред.</Mybutton>
                        <Mybutton onClick={getId}>След.</Mybutton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;