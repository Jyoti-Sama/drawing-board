import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'

import styles from './style.module.css'

const url = './video.mp4'

function Player() {
    const [videoLength, setvideoLength] = useState(100)
    const [currentDuration, setcurrentDuration] = useState(0)
    const [value, setvalue] = useState('')
    const [transcriptEnd, settranscriptEnd] = useState(0)

    // const [subtitleFile, setsubtitleFile] = useState('')

    const myTranscript = useRef({})

    // useEffect(() => {
    //     var ctx = new AudioContext();
    //     var audio = document.getElementById('myAudio');
    //     // var audioSrc = ctx.createMediaElementSource(audio);
    //     var analyser = ctx.createAnalyser();
    //     // we have to connect the MediaElementSource with the analyser 
    //     // audioSrc.connect(analyser);
    //     // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)

    //     // frequencyBinCount tells you how many values you'll receive from the analyser
    //     // var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    //     console.log(audio)

    //     // we're ready to receive some data!
    //     // loop
    //     // function renderFrame() {
    //     //     requestAnimationFrame(renderFrame);
    //     //     // update data in frequencyData
    //     //     analyser.getByteFrequencyData(frequencyData);
    //     //     // render frame based on values in frequencyData
    //     //     // console.log(frequencyData)
    //     // }
    //     // audio.start();
    //     // renderFrame();
    // }, [])


    useEffect(() => {
        var canvas = document.getElementById('canvas');

        // Make sure we don't execute when canvas isn't supported
        if (canvas.getContext) {

            // use getContext to use the canvas for drawing
            var ctx = canvas.getContext('2d');

            // Reset the current path
            ctx.beginPath();
            // Staring point (10,45)
            ctx.moveTo(20, 50);
            // End point (180,47)
            ctx.lineTo(videoLength, 50);
            // Make the line visible
            ctx.stroke();

            // adding mark
            let j = 0;
            for (let i = 20; i < videoLength; i = i + 100) {

                if (j > 59) {
                    let temp = `${parseInt(j / 60)} : ${j % 60}`;
                    console.log(temp);
                    j++;

                    ctx.moveTo(i, 2);
                    // End point (180,47)
                    ctx.lineTo(i, 10);
                    // Make the line visible
                    ctx.stroke();

                    // adding number time
                    ctx.fillStyle = "black";
                    ctx.font = "bold 10px Arial";
                    ctx.fillText(temp, i - 10, 22)
                } else {
                    let temp = `${parseInt(j / 60)} : ${j % 60}`;
                    j++;

                    ctx.moveTo(i, 2);
                    // End point (180,47)
                    ctx.lineTo(i, 10);
                    // Make the line visible
                    ctx.stroke();

                    // adding number time
                    ctx.fillStyle = "black";
                    ctx.font = "bold 10px Arial";
                    ctx.fillText(temp, i - 10, 22)
                }
            }
        }

    }, [videoLength])

    useEffect(() => {
        document.getElementById('canvas').addEventListener("mousemove", (e) => {
            var mousePos = { 'canvas-x': e.layerX - 120, 'duration-x': currentDuration + (e.layerX - 120) };
            // console.log(mousePos)
        })
    }, [currentDuration])

    const setIndicator = (e) => {
        let xpos = e.clientX - 100;
        let indicator = document.getElementById("indicatoe-2");

        indicator.style.transform = `translateX(${xpos}px)`
        indicator.style.background = `green`;

        settranscriptEnd((xpos - 20) + currentDuration);
    }

    //
    const addTrascript = () => {
        console.log(value, " is set for ", currentDuration, " to ", transcriptEnd);

        let indicator = document.getElementById("indicatoe-2");

        // indicator.style.transform = `translateX(20px)`
        // indicator.style.background = `green`;

        setvalue('');

        // handleSaveToPC({message: "hello"})

        let end = timeFormater(transcriptEnd);
        let start = timeFormater(currentDuration);
        let captionDuration = start + " --> " + end;

        // myTranscript.current.push(captionDuration);
        // myTranscript.current.push(value);

        myTranscript.current[captionDuration] = value;
        // gg();
    }

    const timeFormater = (time) => {
        let temp;
        let sec = parseInt(time / 100);
        let milisec = parseInt((time * 10) % 1000);

        let min = parseInt(sec / 60);
        sec = sec % 60;

        sec = `${sec}`.length < 2 ? `0${sec}` : `${sec}`;
        min = `${min}`.length < 2 ? `0${min}` : `${min}`;
        milisec = `${milisec}`.length < 3 ? `0${milisec}` : `${milisec}`;

        temp = min + ":" + sec + "." + milisec;
        console.log(temp)

        return temp;
    }

    const handleSaveToPC = async (jsonData) => {
        const fileData = jsonData;
        const blob = new Blob([fileData], { type: "vtt/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'filename.vtt';
        link.href = url;
        link.click();
    }

    console.log(myTranscript.current)

    // const gg = () => {

    //     const options = { method: 'GET' };

    //     fetch('http://localhost:5000/subtitle', options)
    //         .then(response => response.blob())
    //         .then(response => {
    //             // console.log(response);
    //             setsubtitleFile(response);
    //         })
    //         .catch(err => console.error(err));
    // }

    const handelDone = () => {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(myTranscript.current)
        };

        fetch('https://drawing-app-internship.herokuapp.com/create-subtitle', options)
            .then(response => response.text())
            .then(response => { console.log(response); handleSaveToPC(response) })
            .catch(err => console.error(err));
    }

    return (
        <div>
            <div>player</div>

            <div>
                <ReactPlayer
                    controls
                    progressInterval={1000}
                    onDuration={(data) => { console.log(data); setvideoLength(data * 100) }}
                    onPause={(data) => { console.log(data.target.currentTime, " <- paused at"); setcurrentDuration(data.target.currentTime * 100) }}
                    onPlay={(data) => console.log("playing")}
                    onStart={(data) => console.log("playing for the first time")}
                    onSeek={data => { console.log('onSeek', data); setcurrentDuration(data * 100) }}
                    url={url}


                    height={"240px"}

                    config={{
                        file: {
                            tracks: [
                                { kind: 'subtitles', src: "./filename.vtt", srcLang: 'en', default: true },
                            ]
                        }
                    }}
                />
            </div>

            <div style={{ /* overflow: "hidden", */ transform: `translateX(100px)` }}>{/* <div style={{ height: "100px", width: `${videoLength}px`, background: "silver", transform: `translateX(-${currentDuration}px)` }}></div> */}
                <canvas onClick={(e) => setIndicator(e)} id="canvas" height="100" width={`${videoLength + 40}`} className={styles.mycanvas} style={{ transform: `translateX(-${currentDuration}px)` }}></canvas>
                <div className={styles.timeIndicator}></div>

                <div className={styles.timeIndicator} id="indicatoe-2"></div>
            </div>

            <div>
                <input
                    style={{ padding: "10px 20px", outline: "none", width: "220px" }}
                    value={value}
                    onChange={(e) => setvalue(e.target.value)}
                // style={{borderColor: valueErr ? "red" : "black"}}
                />
            </div>

            <button onClick={() => addTrascript()}>Add</button>
            <button onClick={() => handelDone()}>done</button>

            <audio id="myAudio" controls src={url}></audio>
        </div>
    )
}

export default Player



// <!DOCTYPE html>
// <html>

// <head>
//  <title>
//   Creating an audio visualizer
//   using HTML CANVAS API
//  </title>
// </head>
{/* 
<body>
 <h1 style="color:green">
  GeeksforGeeks
 </h1>
 <h3>
  How to make an audio visualizer
  with HTML CANVAS API?
 </h3> */}

{/* <button id="mybtn">Click Me</button> */ }

{/* <canvas id="visualizer" width="100px"
    height="100px" style="border:5px solid blue;
    border-radius:100px">
</canvas> */}

{/* <script type="text/javascript"> */ }
{/* var btn = document.getElementById("mybtn");
  var visualizer = document.getElementById("visualizer");
  btn.onclick = async () => {
   
   }
  } */}
{/* </script>
</body>

</html> */}
