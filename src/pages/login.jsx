import React, {useState} from 'react';
import cl from './logreg.module.css'
import Myinput from "../componentes/myinput/myinput";
import Mybutton from "../componentes/mybutton/mybutton";
import {Link, useNavigate} from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import getApp from "../js/getApp";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {useCookies} from "react-cookie";
import Loading from "../componentes/loading/loading";

const Login = () => {
    const app = getApp()
    const auth = getAuth(app);
    const db = getFirestore(app)
    const [login, setLogin] = useState('')
    const [pass, setPass] = useState('')
    const nav = useNavigate()
    const [cookie, setCookie] = useCookies('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const sign = async () => {
        setLoading(true)
        let email = await getDoc(doc(db, 'users', login))
        email = email.data()
        if (!email){
            setError('Пользователь не найден')
            return
        }
        else{
            email = email.email
            signInWithEmailAndPassword(auth, email, pass)
                .then(() => {
                    setCookie('login', login)
                    nav('/')
                })
                .catch((error) => {
                    setLoading(false)
                    if (error.code == 'auth/wrong-password'){
                        setError('Неправильный пароль')
                    } else{
                        console.error(error.message)
                    }
                });
        }


    }

    return (
        <div className={cl.logregwin}>
            <p>Войти</p>
            <Myinput text={'Логин'} onChange={e => setLogin(e.target.value)} />
            <Myinput text={'Пароль'} onChange={e => setPass(e.target.value)} />
            <Mybutton onClick={sign} style={{width: '100%', height: '45px', margin: '20px 0'}}>{loading ? <Loading style={{width: '30px', height: '30px'}} /> : 'Войти'}</Mybutton>
            <Link to={'/signup'}>Зарегистрироваться</Link>
            <p className={cl.error}>{error}</p>
            <a href="/"><Mybutton style={{width: '100%', height: '45px', marginTop: '50px', marginLeft: '0'}}>Войти без регистрации</Mybutton></a>
        </div>
    );
};

export default Login;