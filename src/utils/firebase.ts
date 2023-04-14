import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/auth'
const config = {
  apiKey: 'AIzaSyDKH-J8wu-ZMKRQTl-jeWJBjtaXdtZC-so',
  authDomain: 'blockchain-cbex-test.firebaseapp.com',
  databaseURL: 'https://blockchain-cbex-test-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'blockchain-cbex-test',
  storageBucket: 'blockchain-cbex-test.appspot.com',
  messagingSenderId: '627831954487',
  appId: '1:627831954487:web:f4df54c75ce37c26f9f3b2',
  measurementId: 'G-131NK8VPYY'
}
firebase.initializeApp(config)

export default firebase
