import React, { useState, useEffect } from 'react';
import { Router, Redirect } from '@reach/router';
import Nav from './Nav';
import Channel from './Channel';
import { firebase, db, setupPresence } from './firebase';

function App() {
  const user = useAuth();
  const [authError, setAuthError] = useState(null);
  const handleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      setAuthError(error);
    }
  };
  return user ? (
    <div className="App">
      <Nav user={user} />
      <Router>
        <Channel path="channel/:channelId" user={user} />
        <Redirect from="/" to="channel/general" />
      </Router>
    </div>
  ) : (
    <div className="Login">
      <h1>Chat</h1>
      <button type="button" onClick={handleSignIn}>
        Sign in with Google
      </button>
      {authError && (
        <div>
          <p>A problem occured</p>
          <p>
            <i>{authError.message}</i>
          </p>
          <p>Please try again</p>
        </div>
      )}
    </div>
  );
}

export default App;

function useAuth() {
  const [user, setUser] = useState(null);
  useEffect(
    () =>
      firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
          const user = {
            displayName: firebaseUser.displayName,
            photoUrl: firebaseUser.photoURL,
            uid: firebaseUser.uid,
          };
          setUser(user);
          db.collection('users')
            .doc(user.uid)
            .set(user, { merge: true });
          setupPresence(user);
        } else {
          setUser(null);
        }
      }),
    []
  );
  return user;
}
