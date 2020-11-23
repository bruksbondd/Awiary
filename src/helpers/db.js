import { db, auth } from "../services/firebase";
import { changeFormatDate } from './changeFormatDate'

const d = new Date();
const time = `${d.getDate()}${(d.getMonth()+1)}${d.getFullYear()}`;

export function readChats() {
  let abc = [];
  return db.ref("chats").on("value", snapshot => {
    snapshot.forEach(snap => {
      abc.push(snap.val())
    });
    return abc;
  });
}

export function writeChats(message) {
  return db.ref("users").push({
    content: message.content,
    timestamp: message.timestamp,
    uid: message.uid
  });
}

export function writeSmile(id) {
  const userAuth = auth().currentUser
  return db.ref(userAuth.uid +'/smile/'+ time + '/'+ Date.now()).set({
    id: id,
    key: Date.now(),
    todayData: changeFormatDate(Date.now())
    // uid: message.uid
  });
}

export function readSmiles() {
 const userAuth = auth().currentUser.uid
 return db.ref(userAuth +'/smile/' + time + '/').once('value')
   .then(snapshot => {
     return  snapshot.val()
   });
}


function readSmile() {
  const userAuth = auth().currentUser.uid
  let newPostKey = db.ref().child('smile').push().key;

  db.ref(userAuth + '/smile/')
    .on('value', snapshot => {
      // console.log('User data: ', snapshot.val());
    });

  db.ref(userAuth + '/smile/').orderByChild("todayData").equalTo("26/4/2020").on("child_added", function(data) {
    // console.log("Equal to filter: " + data.val().id);
  });
}










