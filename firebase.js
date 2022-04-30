/**
 * Inicialização Firebase
 */
const admin = require('firebase-admin');

// if (process.env.NODE_ENV == "production") {
//   var serviceAccount = require("./config/atla-app-master-firebase-adminsdk.json");
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://atla-app-master.firebaseio.com"
//   });
// } else {
const serviceAccount = require('./config/atla-app-dev-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://atla-app-dev.firebaseio.com',
});
// }

const db = admin.database();
const ref = db.ref('/messages/{message}');

ref.once('value', (snapshot) => {
  console.log('onMessage', snapshot.val());
});

console.log('Firebase inicializado');

// exports.onChatMessage = functions.firestore
//   .document("messages/{message}")
//   .onWrite(async (snap, context) => {
//     const newValue = snap.after.data();
//     if (newValue) {
//       const senderId = newValue.senderId;
//       const receiverId = newValue.receiverId;
//       const content = newValue.content;
//       return await sendPushToProfileInternal(senderId, receiverId, content);
//     }
//     return null;
//   });
