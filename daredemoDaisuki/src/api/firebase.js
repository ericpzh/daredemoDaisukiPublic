import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/storage';

import { apikey, authDomain, databaseURL, storageBucket } from '../secret.js';

export function updateProfile(username, password, newImage, currImage, userFunction, userBegin, userSuccess, userFailure){
  /*
  Upload / update profile image to firebase
  */
  const firebaseConfig = {
    apiKey: apikey,
    authDomain: authDomain,
    databaseURL: databaseURL,
    storageBucket: storageBucket,
  };
  firebase.initializeApp(firebaseConfig); // Initialize Firebase
  var storage = firebase.storage();
  var storageRef = storage.ref();
  userBegin();
  var file = newImage;
  var metadata = { // Create the file metadata
    name: username,
    contentType: 'image/png'
  };
  var uploadTask = storageRef.child('images/' + username + '.png').put(file, metadata); // Upload file and metadata to the object 'images/mountains.jpg'
  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED, // Listen for state changes, errors, and completion of the upload. // or 'state_changed'
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    },
    (error)=>{
      console.log(error.code) //'storage/unauthorized' or 'storage/canceled' or 'storage/unknown'
      firebase.app().delete();
      userFailure();
    },
    () => {
    uploadTask.snapshot.ref.getDownloadURL()  // Upload completed successfully, now we can get the download URL
    .then(
      (downloadURL) => {
        console.log(downloadURL);
        firebase.app().delete();
        userFunction(username, password, downloadURL, userBegin, userSuccess, userFailure);
      }
    );
    }
  );
}
