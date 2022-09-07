import React, { useEffect, useRef, useState } from 'react'
import { fabric } from "fabric";
import io from 'socket.io-client';
const SOCKET_URL = "http://localhost:5000";

function App3() {
    const [canvas, setcanvas] = useState(new fabric.Canvas('board', {
        selectionBorderColor: "black",
        backgroundColor: "pink",
        // isDrawingMode: true,
        height: 500,
        width: 500
    }));

    const socket = io.connect('http://localhost:5000');

    const addRect = () => {
        var rect = new fabric.Rect({ height: 30, width: 30, fill: '#f55', top: 200, left: 100 });
        rect.set('selectable', true);

        rect.on("mouse:dblclick", (e) => {
            console.log(e);
            // rect.top = 
        })

        canvas.add(rect);
        canvas.renderAll();
    }

    const addCir = (canvi) => {
        var cir = new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 });
        // cir.set('selectable', true);

        cir.on("mouse:over", (e) => {
            console.log("circle");
            // rect.top = 
        })

        canvi.add(cir);
        canvi.renderAll();


    }

    const addText = () => {
        let text = new fabric.Text("hello world", { left: 200, top: 100, selectable: false, evented: false });
        canvas.add(text);
        canvas.renderAll();
    }

    const sendData = () => {
        var base64DataImage = canvas.toDataURL("image/png");
        socket.emit('drawing data client to server', base64DataImage)
        console.log("sent")
    }

    useEffect(() => {
        let temp = new fabric.Canvas('board', {
            selectionBorderColor: "black",
            backgroundColor: "pink",
            // isDrawingMode: true,
            height: 500,
            width: 500
        })
        

        /* Mouse Capturing Work */
        // canvas.addEventListener('mousemove', function (e) {
        //     last_mouse.x = mouse.x;
        //     last_mouse.y = mouse.y;

        //     mouse.x = e.pageX - this.offsetLeft;
        //     mouse.y = e.pageY - this.offsetTop;
        // }, false);


        // /* Drawing on Paint App */
        // ctx.lineWidth = 5;
        // ctx.lineJoin = 'round';
        // ctx.lineCap = 'round';
        // ctx.strokeStyle = 'blue';

        // canvas.addEventListener('mousedown', function (e) {
        //     canvas.addEventListener('mousemove', onPaint, false);
        // }, false);

        // canvas.addEventListener('mouseup', function () {
        //     canvas.removeEventListener('mousemove', onPaint, false);
        // }, false);

        // temp.on('mouse:down', () => {
        //     temp.on('mouse:move', sendData(), false)
        // }, false)

        // temp.on('mouse:up', () => {
        //     temp.on('mouse:move', sendData())
        // });

        // temp.on("mouse:up", sendData())

        setcanvas(temp);
    }, [])

    useEffect(() => {
        socket.on('drawing data server to client', (data) => {
            console.log(data)

            // Initialize a simple canvas
            // let temp = new fabric.Canvas('board', {
            //     selectionBorderColor: "black",
            //     backgroundColor: "pink",
            //     // isDrawingMode: true,
            //     height: 500,
            //     width: 500
            // });
            // setcanvas(temp)

            // Create a new instance of the Image class
            // let img = new Image();

            // When the image loads, set it as background image
            // img.onload = function () {
            //     var f_img = new fabric.Image(img);
            //     canvas.setOverlayImage(f_img);
            //     canvas.renderAll();
            // };

            // // Set the src of the image with the base64 string
            // img.src = data;

            let image = new window.Image();

            image.addEventListener("load", () => {
                canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height);
            })

            image.setAttribute("src", data)
        })
    }, [socket])



    return (
        <div id="sketch" height={"500px"} width={"500px"}>
            <div onClick={() => addRect()}>add rect</div>
            <div onClick={() => addCir(canvas)}>add circle</div>
            <div onClick={() => addText()}>add text</div>
            <div onClick={() => sendData()}>sent</div>
            <canvas id="board" height={"500px"} width={"500px"} />
        </div>
    )
}

export default App3