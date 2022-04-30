import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

const corsHandler = cors({ origin: true });
const serviceAccount = require("../atla-app-dev-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  ...functions.config().firebase
});

const db = admin.firestore();

const devicesRef = db.collection("devices");

const sendPushToProfileInternal = async (
  senderId: string,
  receiverId: string,
  content: any
) => {
  if (!receiverId || !content) return false;

  const data = (await devicesRef.doc(receiverId).get()).data();
  if (!data) return false;

  const message = {
    data: {
      content,
      senderId
    },
    token: data.token
  };

  console.log(
    "enviando mensagem para " + receiverId + " com token " + data.token
  );

  return await admin.messaging().send(message);
};

// IMPORTANTE
/*
  Essa função pode ser chamada a partir do cliente.
  Todo: encontrar uma forma de restringir o acesso ao servidor
*/
exports.sendPushToProfile = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    console.log("cors");
  });

  const { receiverId, content } = req.body;
  sendPushToProfileInternal("server", receiverId, content)
    .then(() => {
      return res.status(200).send();
    })
    .catch(error => {
      return res.status(400).send();
    });
});

exports.onChatMessage = functions.firestore
  .document("messages/{message}")
  .onWrite(async (snap, context) => {
    const newValue = snap.after.data();
    if (newValue) {
      const senderId = newValue.senderId;
      const receiverId = newValue.receiverId;
      const content = newValue.content;
      return await sendPushToProfileInternal(senderId, receiverId, content);
    }
    return null;
  });

// todo (MUITO IMPORTANTE) verificar token (usuário pode gerar um token apenas para o próprio perfil)
exports.generateFirebaseToken = functions.https.onRequest((req, res) => {
  corsHandler(req, res, () => {
    console.log("cors");
  });
  const { uid } = req.body;

  admin
    .auth()
    .createCustomToken(uid)
    .then(token => {
      return res.status(200).send({ token });
    })
    .catch(error => {
      return res.status(400).send();
    });
});
