import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAxNAQrZvFQSlnkZAW3jCt4A8LXPkIN88I',
  authDomain: 'chat-app-50d27.firebaseapp.com',
  databaseURL: 'https://chat-app-50d27.firebaseio.com',
  projectId: 'chat-app-50d27',
  storageBucket: 'chat-app-50d27.appspot.com',
  messagingSenderId: '754923055159',
  appId: '1:754923055159:web:8b94b83db103f2e0',
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const rtdb = firebase.database();

export function setupPresence(user) {
  const isOfflineForRTDB = {
    state: 'offline',
    lastChanged: firebase.database.ServerValue.TIMESTAMP,
  };
  const isOfflineForFirestore = {
    state: 'offline',
    lastChanged: firebase.firestore.FieldValue.serverTimestamp(),
  };

  const rtdbRef = rtdb.ref(`/status/${user.uid}`);
  const userDoc = db.doc(`/users/${user.uid}`);
  const isOnlineForRTDB = {
    state: 'online',
    lastChanged: firebase.database.ServerValue.TIMESTAMP,
  };
  const isOnlineForFirestore = {
    state: 'online',
    lastChanged: firebase.firestore.FieldValue.serverTimestamp(),
  };
  rtdb.ref('.info/connected').on('value', async snapshot => {
    if (snapshot.val() === false) {
      userDoc.update({
        status: isOfflineForFirestore,
      });
      return;
    }
    await rtdbRef.onDisconnect().set(isOfflineForRTDB);
    rtdbRef.set(isOnlineForRTDB);
    userDoc.update({
      status: isOnlineForFirestore,
    });
  });
}
export { db, firebase };
