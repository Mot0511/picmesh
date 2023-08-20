import React, {useState} from 'react';
import cl from './logreg.module.css'
import Myinput from "../componentes/myinput/myinput";
import Mybutton from "../componentes/mybutton/mybutton";
import {Link, useNavigate} from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import getApp from "../js/getApp";
import {doc, getDoc, getFirestore, setDoc} from "firebase/firestore";
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
    const provider = new GoogleAuthProvider();

    const sign = async () => {
        if (login, pass){
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
    }
    const google = () => {
        auth.languageCode = 'ru';
        signInWithPopup(auth, provider)
            .then(async (result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                // The signed-in user info.
                const user = result.user;
                const data = await getDoc(doc(db, 'users', user.email))
                if (!data.data()){
                    await setDoc(doc(db, "users", user.email), {
                        login: user.email,
                        email: user.email,
                        saved: [],
                        topics: []
                    });

                }
                setCookie('login', user.email)
                nav('/')

            }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage, email);
            console.log(credential);
        });
    }

    return (
        <div className={cl.logregwin}>
            <p>Войти</p>
            <form>
                <Myinput text={'Логин'} onChange={e => setLogin(e.target.value)} required />
                <Myinput text={'Пароль'} onChange={e => setPass(e.target.value)} required />
                <Mybutton onClick={sign} style={{width: '100%', height: '45px', margin: '20px 0'}}>{loading ? <Loading style={{width: '30px', height: '30px'}} /> : 'Войти'}</Mybutton>
                <Link to={'/signup'}>Зарегистрироваться</Link>
            </form>
            <p className={cl.error}>{error}</p>
            <a href="/"><Mybutton style={{width: '100%', height: '45px', marginTop: '50px', marginLeft: '0'}}>Войти без регистрации</Mybutton></a>
            <Mybutton onClick={google} style={{width: '100%', height: '45px', marginTop: '20px', marginLeft: '0'}}>Войти через Google</Mybutton>

        </div>
    );
};

export default Login;