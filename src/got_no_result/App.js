import React from "react";
import { fabric } from "fabric";
import io from 'socket.io-client';
const SOCKET_URL = "http://localhost:5000";
// import "./styles.css";

class App extends React.Component {
  timeout;
  socket = io.connect('http://localhost:5000');
  addRect;
  addCir;
  addText;
  canvasRef;

  constructor(props) {
    super(props)

    this.socket.on('drawing data server to client', (data) => {
      console.log(data)

      // Initialize a simple canvas
      var canvas = new fabric.Canvas('board', {
        selectionBorderColor: "black",
        backgroundColor: "pink",
        // isDrawingMode: true,
        height: 500,
        width: 500
      });

      this.canvasRef = canvas
      // Create a new instance of the Image class
      var img = new Image();

      // When the image loads, set it as background image
      img.onload = function () {
        var f_img = new fabric.Image(img);
        canvas.setOverlayImage(f_img);
        canvas.renderAll();
      };

      // Set the src of the image with the base64 string
      img.src = data;

    })
  }


  componentDidMount() {
    // var canvas = new fabric.Canvas('canvas');
    // canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
    // canvas.add(new fabric.Image(""))

    this.drawCanvas()
  }

  drawCanvas() {
    // Initialize a simple canvas
    var canvas

    if(this.canvasRef)  canvas = this.canvasRef;
    else {
      canvas = new fabric.Canvas('board', {
        selectionBorderColor: "black",
        backgroundColor: "pink",
        isDrawingMode: true,
      });
    }
    var ctx = canvas.getContext('2d');
    // this.canvas.selection = true; // disable group selection

    // this.addCir = () => {
    //   var cir = new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 });
    //   // cir.set('selectable', true);
    //   this.canvas.add(cir);
    // }


    this.addRect = () => {
      var rect = new fabric.Rect({ height: 30, width: 30, fill: '#f55', top: 200, left: 100 });
      // rect.set('selectable', true);
      canvas.add(rect);
      // console.log("react add")
    }

    this.addText = () => {
      let text = new fabric.Text("hello world", { left: 200, top: 100, selectable: false, evented: false });
      canvas.add(text);
    }




    // this.canvas.renderAll();
    // this.canvas.forEachObject(function (object) {
    //   object.selectable = false;
    // });


    // this.canvas.on('mouse:move',(event) => {
    //   const mEvent = event.e;
    //   const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);
    //   this.canvas.relativePan(delta)
    // })

    // this.canvas.on("mouse:down",(event) => {
    //   const mEvent = event.e;
    //   const delta = new fabric.Point(mEvent.movementX, mEvent.movementY);

    //   this.canvas.setCursor("crossair")
    //   console.log("pressed")
    //   this.canvas.renderAll()
    // })

    var mouse = { x: 0, y: 0 };
    var last_mouse = { x: 0, y: 0 };

    /* Mouse Capturing Work */
    canvas.on('mouse:move', function (e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    }, false);


    /* Drawing on Paint App */
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'blue';



    canvas.on('mouse:up', () => {
      // canvas.on('mouse:move', )
      onPaint()
    });

    // canvas.on('mouse:down', () => {
    //   canvas.on('mouse:move', onPaint, false)
    // }, false)


    var root = this;
    var onPaint = function () {
      ctx.beginPath();
      ctx.moveTo(last_mouse.x, last_mouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();

      if (root.timeout !== undefined) clearTimeout(root.timeout)
      root.timeout = setTimeout(() => {
        var base64DataImage = canvas.toDataURL("image/png");
        root.socket.emit('drawing data client to server', base64DataImage)
        console.log("sent")
      }, 1000)
    };
  }



  render() {
    return (
      <div id="sketch" height={"500px"} width={"500px"}>
        <div onClick={() => this.addRect()}>add rect</div>
        <div onClick={() => this.addCir()}>add circle</div>
        <div onClick={() => this.addText()}>add text</div>
        <canvas id="board" height={"500px"} width={"500px"} />
      </div>
    );
  }
}

export default App;