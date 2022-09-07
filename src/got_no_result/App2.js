import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';


const App2 = () => {
    const [canvas, setCanvas] = useState("");
    const socket = io('http://localhost:5000')

    useEffect(() => {
        setCanvas(initCanvas());
    }, []);

    const initCanvas = () =>
        new fabric.Canvas("canvas", {
            height: 400,
            width: 400,
            preserveObjectStacking: true,
            backgroundColor: "pink"
        });

    const addRect = (canvi) => {
        const rect = new fabric.Rect({
            height: 280,
            width: 200,
            fill: "yellow"
        });
        canvi.add(rect);
        canvi.renderAll();
    };

    const addCircle = () => {
        const circle = new fabric.Circle({
            radius: 20,
            fill: "green",
            left: 100,
            top: 100
        });
        canvas.add(circle);
        canvas.renderAll();
    };

    const addText = () => {
        const comicSansText = new fabric.Text("I'm in Comic Sans", {
            fontFamily: "Comic Sans"
        });
        canvas.add(comicSansText);
        canvas.renderAll();
    };


    useEffect(() => {
        socket.on('drawing data server to client', (data) => {
            console.log(data, "from backend");
            // canvas._objects = data;
            canvas.renderAll();
        })
    }, [socket])

    // const fire = () => {
    //     socket.emit('drawing data client to server', canvas._objects.map(item => {
    //         if ("id" in item.aCoords) { return item.aCoords }
    //         item.aCoords.id = uuidv4();
    //         return item.aCoords
    //     }))
    // }

    const fire = () => {
        let base64ImageDataUrl = canvas.toDataUrl("image/png")
        socket.emit('drawing data client to server', base64ImageDataUrl)
    }



    return (
        <div>
            <h1>Canvas on React - fabric.Canvas('...')</h1>
            <button onClick={() => addRect(canvas)}>Rectangle</button>
            <button onClick={() => addCircle()}>Circle</button>
            <button onClick={() => { addText(); fire() }}>Text</button>

            <button onClick={() => {console.log(canvas); canvas.renderAll()}}>show</button>
            
            <br />
            <br />
            <canvas id="canvas" />
        </div>
    );
};

export default App2;
