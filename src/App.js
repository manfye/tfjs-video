import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import padSequences from './helper/paddedSeq'
import {
  TextField,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button


} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import imageDataURI from 'image-data-uri'

import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';

function App() {
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));
  const classes = useStyles();

  const url = {

    model: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
    metadata: 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json'
};



const [inputText, setInput] = useState("")
const [imageData, setImageData] = useState("hand.jpg")

async function loadModel(url) {
  
  try {
    // Load the MediaPipe handpose model.
  const model = await handpose.load();
  // Pass in a video stream (or an image, canvas, or 3D tensor) to obtain a
  // hand prediction from the MediaPipe graph.
  predictionFunction()
  } catch (err) {
    console.log(err);
  }
   
  
  
}



function Draw(data, fullData) {
  console.log(data);
  var cnvs = document.getElementById("myCanvas");

  cnvs.style.position = "absolute";

  var ctx = cnvs.getContext("2d");
  ctx.clearRect(0, 0, cnvs.width, cnvs.height);

  fullData.landmarks.map((i) => {
    ctx.beginPath();
    ctx.arc(i[0], i[1], 5, 0, 2 * Math.PI, false);
    ctx.strokeStyle = "#FF0000";

    ctx.lineWidth = 3;
    ctx.stroke();
  });

  // data.middleFinger.map((i) => {
  //   ctx.beginPath();
  //   ctx.arc(i[0], i[1], 5, 0, 2 * Math.PI, false);
  //   ctx.strokeStyle = "#FF0000";

  //   ctx.lineWidth = 3;
  //   ctx.stroke();
  // });

  // data.indexFinger.map((i) => {
  //   ctx.beginPath();
  //   ctx.arc(i[0], i[1], 5, 0, 2 * Math.PI, false);
  //   ctx.strokeStyle = "#FF0000";

  //   ctx.lineWidth = 3;
  //   ctx.stroke();
  // });

  // data.ringFinger.map((i) => {
  //   ctx.beginPath();
  //   ctx.arc(i[0], i[1], 5, 0, 2 * Math.PI, false);
  //   ctx.strokeStyle = "#FF0000";

  //   ctx.lineWidth = 3;
  //   ctx.stroke();
  // });

  // data.thumb.map((i) => {
  //   ctx.beginPath();
  //   ctx.arc(i[0], i[1], 5, 0, 2 * Math.PI, true);
  //   ctx.strokeStyle = "#FF0000";

  //   ctx.lineWidth = 3;
  //   ctx.stroke();
  // });

  
  // data.pinky.map((i) => {
  //   ctx.beginPath();
  //   ctx.arc(i[0], i[1], 5, 0, 2 * Math.PI, false);
  //   ctx.strokeStyle = "#FF0000";

  //   ctx.lineWidth = 3;
  //   ctx.stroke();
  // });

  // data.palmBase.map((i) => {
  //   ctx.beginPath();
  //   ctx.arc(i[0], i[1], 5, 0, 2 * Math.PI, false);
  //   ctx.strokeStyle = "#FF0000";

  //   ctx.lineWidth = 3;
  //   ctx.stroke();
  // });



}

 async function predictionFunction(){
  const model = await handpose.load();
console.log("Loading")

  const predictions = await model.estimateHands(document.getElementById('img'));
  if (predictions.length > 0) {
    console.log(predictions)
Draw(predictions[0].annotations,predictions[0])
    for (let i = 0; i < predictions.length; i++) {
      const keypoints = predictions[i].landmarks;

      // Log hand keypoints.
      for (let i = 0; i < keypoints.length; i++) {
        const [x, y, z] = keypoints[i];
        console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
      }
    }
  }
  else{
    console.log(predictions)
    console.log("No hand detected")
    var cnvs = document.getElementById("myCanvas");

    cnvs.style.position = "absolute";
  
    var ctx = cnvs.getContext("2d");
    ctx.clearRect(0, 0, cnvs.width, cnvs.height);
  
  }
}

useEffect(() => {
  predictionFunction()
}, [imageData])

  




useEffect(()=>{
  tf.ready().then(
    ()=>{
      loadModel(url)

    }
  );

},[])


const handleCapture = (target) => {
  if (target.files) {
    if (target.files.length !== 0) {
      const file = target.files[0];
      const newUrl = URL.createObjectURL(file);
      setImageData(newUrl);
      predictionFunction()
    
    }
  }}


  return (

     <>
       <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            TensorflowJS Test
          </Typography>
        </Toolbar>
      </AppBar>
      <Button variant={"outlined"} onClick ={()=>{setImageData("hand2.jpg")}}>Hand 2</Button>
      <Button variant={"outlined"} onClick ={()=>{setImageData("hand.jpg")}}>Hand 1</Button>

      <input accept="image/*" id="icon-button-file" type="file" capture="environment" onChange={(e) => handleCapture(e.target)}/>

      <Grid container style={{ height:"90vh", }}>
      
      <img style={{width:960, height: 540, objectFit: "contain"}} id="img" src={imageData}></img>

<canvas id='myCanvas' width={960} height={540} style={{backgroundColor:"transparent"}} />



      </Grid>
      <Button onClick ={()=>{setImageData("hand2.jpg")}}></Button>
     </>
    
  );
}

export default App;
