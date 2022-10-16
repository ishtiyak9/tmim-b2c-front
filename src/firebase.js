// import firebase from "firebase/app";
// import "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyBlENf-G26iIvrV8mY-B6UsTy4RIvt1WRY",
//   authDomain: "python-firebase-2208f.firebaseapp.com",
//   databaseURL: "https://python-firebase-2208f-default-rtdb.firebaseio.com",
//   projectId: "python-firebase-2208f",
//   storageBucket: "python-firebase-2208f.appspot.com",
//   messagingSenderId: "308142962690",
//   appId: "1:308142962690:web:ff69351cf49b63a7714f1b",
//   measurementId: "G-8XJYW0VTRV",
// };

// firebase.initializeApp(firebaseConfig);

// export const messaging = firebase.messaging();
// export const getToken = () => {
//   return messaging
//     .getToken({
//       vapidKey:
//         "BPrOg5Qvr2NUM-JDRFXxkCzFHLbP4aHOlUWZyKY6AuEBbYHQu76f_y2jm7g0gDyhetYFm8K0ygKebt2cz9QRx_4",
//     })
//     .then((currentToken) => {
//       if (currentToken) {
//         localStorage.setItem("firebase_token", currentToken);
//         console.log("current token for client: ", currentToken);
//       } else {
//         console.log(
//           "No registration token available. Request permission to generate one."
//         );
//       }
//     })
//     .catch((err) => {
//       console.log("An error occurred while retrieving token. ", err);
//     });
// };
