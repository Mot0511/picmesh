import React, {useState} from 'react';
import cl from './logreg.module.css'
import Myinput from "../componentes/myinput/myinput";
import Mybutton from "../componentes/mybutton/mybutton";
import {Link, useNavigate} from "react-router-dom";
import getApp from "../js/getApp";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
import {useCookies} from "react-cookie";
import Loading from "../componentes/loading/loading";

const Reg = () => {
    const app = getApp()
    const auth = getAuth(app);
    const nav = useNavigate()
    const db = getFirestore(app);
    const [cookie, setCookie] = useCookies('')
    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const sign = async () => {
        setLoading(true)
        console.log(email);
        createUserWithEmailAndPassword(auth, email, pass)
            .then(async () => {
                setCookie('login', login)
                await setDoc(doc(db, "users", login), {
                    login: login,
                    email: email,
                    saved: [],
                    topics: []
                });
                nav('/')
            })
            .catch((error) => {
                setLoading(false)
                if (error.code == 'auth/invalid-email'){
                    setError('Некорректная почта')
                }
                else if(error.code == 'auth/email-already-in-use'){
                    setError('Такой пользователь уже существует')
                }
                else{
                    console.error(error.message);
                }

            });

    }

    return (
        <div className={cl.logregwin}>
            <p>Зарегистрироваться</p>
            <Myinput text={'Логин'} onChange={e => setLogin(e.target.value)} />
            <Myinput text={'Почта'} onChange={e => setEmail(e.target.value)} />
            <Myinput text={'Пароль'} onChange={e => setPass(e.target.value)} />
            <Mybutton onClick={sign} style={{width: '100%', height: '45px', margin: '20px 0'}}>{loading ? <Loading style={{width: '30px', height: '30px'}} /> : 'Зарегистрироваться'}</Mybutton>
            <Link to={'/login'}>Войти в существующий аккаунт</Link>
            <p className={cl.error}>{error}</p>
        </div>
    );
};

export default Reg;