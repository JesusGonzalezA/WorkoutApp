import React, { useRef, useState, useEffect } from 'react'

// Tensorflow
import * as tf from '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet';
import { drawKeypoints, drawSkeleton } from './helpers/drawPose'

// WebCam
import Webcam from "react-webcam";
import { getAnglesFromPose } from './helpers/getAnglesFromPose';

const styleCanvas = {
  position: "absolute",
  marginLeft: "auto",
  marginRight: "auto",
  left: 0,
  right: 0,
  textAlign: "center",
  zindex: 9,
  width: 640,
  height: 480,
}

const styleTransparentCanvas = {
  visibility: "hidden",
  marginLeft: "auto",
  marginRight: "auto",
  left: 0,
  right: 0,
  width: 640,
  height: 480,
}

//**************************************************************************
export const App = () => {
  
  const isMounted = useRef( true );
  const webcamRef = useRef( null );
  const canvasRef = useRef( null );

  const [ isLoading, setIsLoading ] = useState(true);
  const [ intervalId, setIntervalId ] = useState(null);
  const [ net, setNet ] = useState(null);


  useEffect(() => {
    return () => {
        isMounted.current = false;
    }
  }, []);

  useEffect( () => {

    const configuration = {
        architecture: 'ResNet50',
        outputStride: 16,
        inputResolution: { width: 640, height: 480 },
        quantBytes: 4
    };

    posenet.load( configuration )
      .then( resp => {
        if (isMounted.current)
          setNet(resp);
      })

  }, []);


  const detect = async () => {  
    
    if (typeof webcamRef.current !== "undefined" 
        && webcamRef.current !== null 
        && webcamRef.current.video.readyState === 4
        && net !== null ){

          // Get video properties
          const video = webcamRef.current.video;
          const videoWidth = webcamRef.current.video.videoWidth;
          const videoHeight = webcamRef.current.video.videoHeight;
          
          // Set video properties
          webcamRef.current.video.width  = videoWidth;
          webcamRef.current.video.height = videoHeight;

          // Make detections
          const pose = await net.estimateSinglePose(video, {
            flipHorizontal: false
          });
          
          setIsLoading(false);

          console.log( getAnglesFromPose( pose ) );
          console.log(pose);
          drawCanvas(pose, video);
    }
  }

  const drawCanvas = (pose, video) => {
    const ctx = canvasRef.current.getContext("2d");
    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;
    

    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  }

  // const handleDetection = () => {
  //   if (intervalId === null)
  //   {
  //     setIntervalId(setInterval(() => {
  //       detect();
  //     }, 100))
  //   }
  //   else {
  //     clearInterval(intervalId);
  //     setIntervalId(null);
  //   }
  // }

  const handleDetection = () => {
    setTimeout(() => {
      detect()
    }, 1500);
  }

  return (
    <div className="container text-center">
      <header>
        <h1>Workout application</h1>
        <hr/>
      </header>

      <main>
        
        {
          isLoading &&
          <h2>Loading...</h2>
        }

        <Webcam 
          ref={ webcamRef }
          style={styleCanvas}
        />

        <canvas 
          ref={ canvasRef }
          style={styleCanvas}
        />

        <div className="mb-5" style={styleTransparentCanvas}/>

        <button 
          className="btn btn-primary"
          onClick={ handleDetection }
        >
          Start/Stop
        </button>
        
      </main>

      <footer>
        Made by Jesús González Álvarez
      </footer>
    </div>
  )
}
//**************************************************************************

export default App;
