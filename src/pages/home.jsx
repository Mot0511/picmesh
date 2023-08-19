import React, {useEffect, useMemo, useState} from 'react';
import cl from './home.module.css'
import Mybutton from "../componentes/mybutton/mybutton";
import getApp from "../js/getApp";
import { getFirestore, setDoc, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import random from "../js/random";
import Loading from "../componentes/loading/loading";
import SavedItem from "../componentes/savedItem/savedItem";
import {useNavigate} from "react-router-dom";
import {useCookies} from "react-cookie";
import {getAuth, signOut} from "firebase/auth";

const Home = () => {
    const login = 'Mot0511'
    const app = getApp()
    const db = getFirestore(app)
    const storage = getStorage(app);

    const [imgs, setImgs] = useState()
    const [topic, setTopic] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [isSavedLoading, setIsSavedLoading] = useState(true)
    const [saved, setSaved] = useState([])
    const [id, setId] = useState('')
    const [cookie, setCookie, removeCookie] = useCookies()
    const nav = useNavigate()

    const getSaved = async () => {
        setIsSavedLoading(true)
        let data = await getDoc(doc(db, 'users', login))
        data = data.data()
        const saved = data.saved
        if (!saved.length){
            setIsSavedLoading(false)
            setSaved([])
            return
        }
        const urls = []
        saved.map(id => {
            const topic = id.split('_')[0]
            getDownloadURL(ref(storage, `${topic}/${id}.png`))
                .then(url => {
                    urls.push([url, id])
                    setIsSavedLoading(false)
                })
                .catch(err => {
                    console.error(err)
                })
        })
        setSaved(urls)

    }

    useEffect(() => {
        getId()
        getSaved()
    }, [])

    const getImg = async (topic, id) => {
        console.log(topic, id);
        getDownloadURL(ref(storage, `${topic}/${id}.png`))
            .then(url => {
                setId(id)
                setImgs(url)
                setTopic(topic)
                setIsLoading(false)
            })
            .catch(err => {
                console.error(err)
            })
    }

    const getId = async () => {
        setIsLoading(true)
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
        setIsLoading(true)
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
    const save = async () => {
        setIsSavedLoading(true)
        await updateDoc(doc(db, 'users', login), {
            saved: arrayUnion(id)
        })
        getDownloadURL(ref(storage, `${topic}/${id}.png`))
            .then(url => {
                setSaved([...saved, [url, id]])
                setIsSavedLoading(false)
            })
            .catch(err => {
                console.error(err)
            })
    }
    const remove = async (id) => {
        setIsSavedLoading(true)
        const topic = id.split('_')[0]
        await updateDoc(doc(db, 'users', login), {
            saved: arrayRemove(id)
        })
        getDownloadURL(ref(storage, `${topic}/${id}.png`))
            .then(url => {
                const tmp = saved.filter(el => el[1] != id)
                setSaved(tmp)
                setIsSavedLoading(false)
            })
            .catch(err => {
                console.error(err)
            })
    }
    const logout = () => {

        const auth = getAuth();
        signOut(auth).then(() => {
            removeCookie('login')
            nav('/login')
        }).catch((error) => {
            console.error(error.message)
        });
    }
    return (

            <div className={cl.content}>
                <div className={cl.imageContainer}>
                    {
                        isLoading ? <Loading /> : <img src={imgs} className={cl.image} alt=""/>
                    }
                </div>
                <div className={cl.controls}>

                    <div className={cl.buttons}>
                        <Mybutton onClick={() => {
                            if (cookie.login) {
                                action(0)
                            }
                            else {
                                nav('/login')
                            }
                        }}>Не нравится</Mybutton>
                        <Mybutton onClick={() => {
                            if (cookie.login) {
                                action(1)
                            }
                            else {
                                nav('/login')
                            }
                        }}>Нравится</Mybutton>
                        <Mybutton onClick={() => {
                            if (cookie.login) {
                                save()
                            }
                            else {
                                nav('/login')
                            }
                        }}><a href="#saved">Сохранить</a></Mybutton>
                        <Mybutton onClick={getId}>След.</Mybutton>
                        <Mybutton onClick={logout} style={{width: '100%', height: '40px'}}>Выйти</Mybutton>
                    </div>

                    <div className={cl.saved} id={'saved'}>
                        <p className={cl.saved__title}>Сохраненные</p>
                        <div className={cl.savedList}>
                            {
                                isSavedLoading
                                    ? <Loading />
                                    : saved.map(url => <SavedItem src={url[0]} id={url[1]} remove={remove} onClick={() => setImgs(url)} />)

                            }
                        </div>

                    </div>
                </div>
            </div>

    );
};

export default Home;