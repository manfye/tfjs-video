import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  TextField,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import * as handpose from "@tensorflow-models/handpose";
// import * as tf from "@tensorflow/tfjs-core";
import * as tf from "@tensorflow/tfjs";
import {loadGraphModel} from '@tensorflow/tfjs-converter';



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
    model:
      "https://orangerx.b-cdn.net/model/model.json",
  };

  const [inputText, setInput] = useState("");
  const [imageData, setImageData] = useState("");
  const [model, setModel] = useState();
  const [predictionData, setPredictionData] = useState('')
  async function loadModel(url) {
    try {
      const model = await tf.loadGraphModel(url.model);
      setModel(model);
      console.log("setloadedModel")
    } catch (err) {
      console.log(err);
      console.log("failed load model")

    }


  }

  // function Draw(data, fullData) {
  //   console.log(data);
  //   var cnvs = document.getElementById("myCanvas");

  //   cnvs.style.position = "absolute";

  //   var ctx = cnvs.getContext("2d");
  //   ctx.clearRect(0, 0, cnvs.width, cnvs.height);

  //   fullData.landmarks.map((i) => {
  //     ctx.beginPath();
  //     ctx.arc(i[0], i[1], 5, 0, 2 * Math.PI, false);
  //     ctx.strokeStyle = "#FF0000";

  //     ctx.lineWidth = 3;
  //     ctx.stroke();
  //   });
  // }

  // async function predictionFunction() {
  //   const model = await handpose.load();
  //   console.log("Loading");

  //   const predictions = await model.estimateHands(
  //     document.getElementById("img")
  //   );
  //   if (predictions.length > 0) {
  //     console.log(predictions);
  //     Draw(predictions[0].annotations, predictions[0]);
  //     for (let i = 0; i < predictions.length; i++) {
  //       const keypoints = predictions[i].landmarks;

  //       // Log hand keypoints.
  //       for (let i = 0; i < keypoints.length; i++) {
  //         const [x, y, z] = keypoints[i];
  //         console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
  //       }
  //     }
  //   } else {
  //     console.log(predictions);
  //     console.log("No hand detected");
  //     var cnvs = document.getElementById("myCanvas");

  //     cnvs.style.position = "absolute";

  //     var ctx = cnvs.getContext("2d");
  //     ctx.clearRect(0, 0, cnvs.width, cnvs.height);
  //   }
  // }

  // useEffect(() => {
  //   predictionFunction();
  // }, [imageData]);

  useEffect(() => {
    tf.ready().then(() => {
      loadModel(url);
    });
  }, []);

 

  async function  predictTuber(){
    setPredictionData("")
try{
  let tensor = tf.browser.fromPixels(document.getElementById("img"), 3)
		.resizeNearestNeighbor([224, 224]) // change the image size
		.expandDims()
		.toFloat()
		.reverse(-1); // RGB -> BGR
  let predictions = await model.predict(tensor).data();
  console.log(predictions);

  setPredictionData(predictions)
  
}
catch (err){
  console.log(err)
}

}

  const handleCapture = (target) => {
    if (target.files) {
      if (target.files.length !== 0) {
        const file = target.files[0];
        const newUrl = URL.createObjectURL(file);
        setImageData(newUrl);
      }
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            TensorflowJS Image Classification
          </Typography>
        </Toolbar>
      </AppBar>
     
      <Box mt={1}/>
      <Grid container style={{ height: "90vh", padding: 20 }}>
  
        <Grid item xs={12} md={6}>
        <Button
        variant={"outlined"}
        onClick={() => {
          setImageData("normal.png");
        }}
      >
        Normal
      </Button>
      <Button
        variant={"outlined"}
        onClick={() => {
          setImageData("tuber.png");
        }}
      >
       Tuber
      </Button>
      <Box mt={1}/>
      <input
        accept="image/*"
        id="icon-button-file"
        type="file"
        capture="environment"
        onChange={(e) => handleCapture(e.target)}
      />
      <Box mt={2}/>
    
      <Button
        variant={"contained"}
        style={{color:"white", backgroundColor:"blueviolet"}}
        onClick={() => {
          predictTuber()
        }}
      >
       Predict
      </Button>
          <Box mt={2}/>
{predictionData? <>  
 <Typography>{"Normal: "+predictionData[0]}</Typography>
 <Typography>{"Tuber: "+predictionData[1]}</Typography> </>
: null     
}
        </Grid>
        <Grid item xs={12} md={6}>
        <img
          style={{ width: "50%", objectFit: "fill" }}
          id="img"
          src={imageData}
        ></img>
          
</Grid>
     

        {/* <canvas
          id="myCanvas"
          width={960}
          height={540}
          style={{ backgroundColor: "transparent" }}
        /> */}
      </Grid>
      <Button
        onClick={() => {
          setImageData("hand2.jpg");
        }}
      ></Button>
    </>
  );
}

export default App;
