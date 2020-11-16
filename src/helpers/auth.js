import { firebase, db, auth, setupPresence } from '../services/firebase';
import { useState, useEffect } from 'react';

export function signup(email, password) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function signin(email, password) {
  return auth().signInWithEmailAndPassword(email, password);
}

export function signInWithGoogle() {
  const provider = new auth.GoogleAuthProvider();
  return auth().signInWithPopup(provider);
}

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const user = {
          displayName: firebaseUser.displayName,
          photoUrl: firebaseUser.photoURL,
          uid: firebaseUser.uid,
        };
        setUser(user);

        db.collection('users').doc(user.uid).set(user, { merge: true });

        setupPresence(user);
      } else {
        setUser(null);
      }
    });
  }, []);
  return user;
}

// export function signInWithGitHub() {
//   const provider = new auth.GithubAuthProvider();
//   return auth().signInWithPopup(provider);
// }

// export function logout() {
//   return auth().signOut();
// }
