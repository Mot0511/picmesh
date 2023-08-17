import React, {useEffect, useMemo, useState} from 'react';
import cl from './App.module.css'
import Mybutton from "./componentes/mybutton/mybutton";
import getApp from "./js/getApp";
import { getFirestore, setDoc, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import random from "./js/random";

const App = () => {
    const login = 'Mot0511'
    const app = getApp()
    const db = getFirestore(app)
    const storage = getStorage(app);

    const [imgs, setImgs] = useState()
    const [topic, setTopic] = useState()

    useEffect(() => {
            getId()
    }, [])

    const getImg = async (topic, id) => {
        console.log(topic, id);
        getDownloadURL(ref(storage, `${topic}/${id}.png`))
            .then(url => {
                setImgs(url)
                setTopic(topic)
            })
            .catch(err => {
                console.error(err)
            })
    }
    const getId = async () => {

        let id
        let topic
        let data = await getDoc(doc(db, 'users', login))
        data = data.data()
        if (data.topics.length && random(2) != 0){
            const topics = data.topics
            let sum = 0
            topics.map(el => sum += el)
            const percents = topics.map(el => el ? el / sum * 100 : 0)
            const pos = random(101)
            const a = []
            for (let i = 0; i < topics.length; i++){
                a.push({id: i, int: topics[i]})
            }
            console.log(a);

            console.log('Pos: '+pos+' Percents: '+percents);

            let rand = Math.floor(Math.random() * sum);
            let i = 0;
            for (let s = a[0].int; s <= rand; s += a[i].int) {
                i++;
            }

            topic = a[i].id

            console.log('Topic: '+topic);
            const topicData = await getDoc(doc(db, 'topics', String(topic)))
            const count = topicData.data()
            const imgId = random(count.count)
            id = topic+'_'+imgId
        }
        else{
            console.log('NOT LIKED')
            topic = random(6)
            const topicData = await getDoc(doc(db, 'topics', String(topic)))
            const count = topicData.data()
            const imgId = random(count.count)
            id = topic+'_'+imgId
        }
        getImg(topic, id)
    }

    const action = async (action) => {
        let data = await getDoc(doc(db, 'users', login))
        data = data.data()
        let topics = data.topics
        if (action){
            if (topics[topic]){
                topics[topic] = topics[topic] + 1
            }
            else{
                topics[topic] = 1
            }
        }
        else{
            if (topics[topic]){
                topics[topic] = topics[topic] - 1
            }
        }
        for (let i = 0; i < topics.length; i++ ) {
            if (typeof topics[i] === "undefined") {
                topics[i] = 0;
            }
        }
        await updateDoc(doc(db, 'users', login), {
            topics: topics
        })

        getId()
    }

    return (
        <div className={cl.container}>
            <div className={cl.content}>
                <div className={cl.image} style={{backgroundImage: `url(${imgs})`}}>

                </div>
                <div className={cl.controls}>
                    <div className={cl.buttons}>
                        <Mybutton onClick={() => action(0)}>Не нравится</Mybutton>
                        <Mybutton onClick={() => action(1)}>Нравится</Mybutton>
                        <Mybutton>Пред.</Mybutton>
                        <Mybutton onClick={getId}>След.</Mybutton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;