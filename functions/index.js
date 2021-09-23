const functions = require('firebase-functions')
const admin = require('firebase-admin')
//const express = require('express')
//const app = express()// both line are same either way you can write the function.
const app = require('express')()
admin.initializeApp()
const firebaseConfig = {
  apiKey: 'AIzaSyC1kNkcVYi535xAPdyWx2XF5dNTkIkki2s',
  authDomain: 'socialnetworkapp-91568.firebaseapp.com',
  projectId: 'socialnetworkapp-91568',
  storageBucket: 'socialnetworkapp-91568.appspot.com',
  messagingSenderId: '215151451079',
  appId: '1:215151451079:web:e7b0ea679b5aa9657897e2',
  measurementId: 'G-D01EWH5RZQ',
}

const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)
app.get('/screams', (req, res) => {
  admin
    .firestore()
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let screams = []
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        })
      })
      return res.json(screams)
    })
    .catch((err) => console.error(err))
})

app.post('/scream', (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  }
  admin
    .firestore()
    .collection('screams')
    .add(newScream)
    .then((doc) => {
      res.json({ message: `document${doc.id} created successfully` })
    })
    .catch((err) => {
      res.status(500).json({ error: 'something went wrong' })
      console.error(err)
    })
})
// signup route
app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  }
  // we are not going to validate the data now (todo).// validate data.
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      return res
        .status(201)
        .json({ message: `user ${data.user.uid} signed up successfully` })
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
})
exports.api = functions.https.onRequest(app)
// exports.api = functions.region('europe-west1').https.onRequest(app). if you want to change your region otherwise by default the function will take us central.
