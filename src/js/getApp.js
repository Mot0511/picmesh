import { initializeApp } from 'firebase/app';

const getApp = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyCVoyXC4MPoKQROKKKW0boPsajohT8wZXw",
        authDomain: "picmesh-e43dd.firebaseapp.com",
        projectId: "picmesh-e43dd",
        storageBucket: "picmesh-e43dd.appspot.com",
        messagingSenderId: "537748922858",
        appId: "1:537748922858:web:c9a11f1252f968a59c5293",
        measurementId: "G-SZPLL2XR2M"
    };

    return initializeApp(firebaseConfig);
}

export default getApp