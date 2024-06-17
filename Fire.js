import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from "firebase/firestore"; // Importar deleteDoc
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB7gj8LuARwn1sBORVV7vy099fC9kAjdLU",
  authDomain: "todo-list-9e202.firebaseapp.com",
  projectId: "todo-list-9e202",
  storageBucket: "todo-list-9e202.appspot.com",
  messagingSenderId: "888422977278",
  appId: "1:888422977278:web:43ced5294af3e6539edfaf",
  measurementId: "G-GCXT4FJVT4"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Inicialize o Auth com persistência
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

class Fire {
  constructor(callback) {
    this.init(callback);
  }

  init(callback) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        callback(null, user);
      } else {
        signInAnonymously(auth)
          .then(({ user }) => {
            callback(null, user);
          })
          .catch((error) => {
            callback(error);
          });
      }
    });
  }

  getLists(callback) {
    const userId = this.userId;
    if (!userId) {
      callback([]);
      return;
    }

    const listsRef = collection(doc(db, 'users', userId), 'lists');
    
    this.unsubscribe = onSnapshot(listsRef, (snapshot) => {
      const lists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      callback(lists);
    });
  }

  addList(list) {
    const userId = this.userId;
    if (!userId) {
      return;
    }

    const listsRef = collection(doc(db, 'users', userId), 'lists');
    
    addDoc(listsRef, list).catch(error => {
      console.error("Error adding document: ", error);
    });
  }

  updateList(list) {
    const userId = this.userId;
    if (!userId) {
      return;
    }

    const listRef = doc(db, 'users', userId, 'lists', list.id);
    
    updateDoc(listRef, list).catch(error => {
      console.error("Error updating document: ", error);
    });
  }

  deleteList(list) {
    const userId = this.userId;
    if (!userId) {
      return;
    }

    const listRef = doc(db, 'users', userId, 'lists', list.id);

    deleteDoc(listRef)
      .then(() => {
        console.log("Documento deletado com sucesso!");
      })
      .catch(error => {
        console.error("Erro ao deletar o documento: ", error);
      });
  }

  get userId() {
    return auth.currentUser ? auth.currentUser.uid : null;
  }

  detach() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default Fire;
