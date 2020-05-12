import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";
import {saveData} from "./AsyncStorage";

firebase.initializeApp(firebaseConfig);
const KEY = "apiKey=ecdea739347f4a58af6b23e5189cbfd5";

export const Firebase = {
    loginWithEmail: (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password).then(res => {
            return firebase.firestore()
                .collection("users")
                .doc(res.user.uid)
                .get()
                .then((snapshot) => {
                    console.log("FROM FIREBASE, Saving user in storage.")
                    saveData(snapshot.data()).then()
                    return (snapshot.data())
                });
        });
    },
    updateCity: (city, uid) => {
        return firebase.firestore()
            .collection("users")
            .doc(uid)
            .update({city: city})
            .then(() => {
                console.log("Updating city...")
                return true
            });
    },
    signupWithEmail: (email, password) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    },
    signOut: () => {
        return firebase.auth().signOut();
    },
    checkUserAuth: user => {
        return firebase.auth().onAuthStateChanged(user);
    },
    passwordReset: email => {
        return firebase.auth().sendPasswordResetEmail(email);
    },
    createNewUser: userData => {
        return firebase
            .firestore()
            .collection("users")
            .doc(`${userData.uid}`)
            .set(userData);
    },
    addToFav: (uid, recipe) => {
        return firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .set({favourites: firebase.firestore.FieldValue.arrayUnion(recipe)}, {merge: true})
            .then(() => {
                console.log("Added to Fav...");
                return true;
            });
    },
    getFavRecipes: (uid) => {
        return firebase
            .firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((snapshot) => {
                let array = []
                snapshot.data().favourites.forEach((data) => {
                    array.push(data)
                })
                return array
            });
    },
};

export const Fetch = {


    getRandom: () => {
        return fetch("https://api.spoonacular.com/recipes/random/?number=20&" + KEY, {
            method: 'get',
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            return data;
        }).catch(r => {
            console.log(r)
        });
    },
    searchRecipe: (searchTerm) => {
        return fetch("https://api.spoonacular.com/recipes/search?query=" + searchTerm + "&number=20&" + KEY, {
            method: 'get',
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            return data;
        }).catch(r => {
            console.log(r)
        });
    },
    getInfoByID: (id) => {
        return fetch("https://api.spoonacular.com/recipes/"+id+"/information?includeNutrition=false&"+KEY, {
            method: 'get',
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            return data;
        }).catch(r => {
            console.log(r)
        });
    }


}

