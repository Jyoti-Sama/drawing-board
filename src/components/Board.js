import React from "react";
import io from 'socket.io-client';
import EventWatch from "./EventWatch";
// import OnlineUsers from "./OnlineUsers";

class Circle {
    constructor(xpoint, ypoint, radius, color) {
        this.xpoint = xpoint;
        this.ypoint = ypoint;
        this.radius = radius;
        this.color = color;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.xpoint, this.ypoint, this.radius, 0, Math.PI * 2, false)
        context.stroke();
        context.closePath();
    }
}

class Rect {
    constructor(xpoint, ypoint, height, width, color) {
        this.xpoint = xpoint;
        this.ypoint = ypoint;
        this.height = height;
        this.width = width;
        this.color = color;
    }

    draw(context) {
        context.beginPath();
        context.lineWidth = "6";
        context.strokeStyle = this.color;
        context.rect(this.xpoint, this.ypoint, this.height, this.width);
        context.stroke();
    }
}

class Board extends React.Component {
    timeout;
    socket = io.connect('https://drawing-app-internship.herokuapp.com');
    drawRect;
    drawCircle;
    moveCircle;
    penColor = "black";
    updateColor;
    roomId = "abc123";

    name = localStorage.getItem("name");
    email = localStorage.getItem("email");

    roomDetails
    popup = ""

    onlineUsers


    constructor(props) {
        super(props)

        this.socket.emit("join", { name: this.name, email: this.email })

        this.socket.on('drawing-data-to-client', (data) => {
            console.log(data.name)

            var image = new Image();
            var canvas = document.querySelector("#board");
            var ctx = canvas.getContext("2d");
            image.onload = function () {
                ctx.drawImage(image, 0, 0);
            };
            image.src = data.base64DataImage;
        })

        // this.socket.on("joinroom", (data) => {
        //     // this.popup = data.data.name + " just joined the room";
        //     this.roomDetails = data.room1Details;

        //     this.popup = "hahahaa"

        //     setTimeout(() => this.popup = "", 1000)
        // })

        // this.socket.on("user-left", (data) => console.log(data))

        // this.popup = "gg boi"


    }

    componentDidMount() {
        this.drawCanvas()
    }

    drawCanvas() {
        var canvas = document.querySelector('#board');
        var ctx = canvas.getContext('2d');

        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        this.updateColor = () => {
            let rect = new Rect(1, 1, 0, 0, this.penColor)
            rect.draw(ctx);
        }


        this.drawRect = () => {
            let rect = new Rect(300, 300, 200, 200, this.penColor)
            rect.draw(ctx);
            onPaint();
        }

        this.drawCircle = () => {
            let circle = new Circle(200, 200, 100, this.penColor);
            circle.draw(ctx);
            onPaint();
        }

        var mouse = { x: 0, y: 0 };
        var last_mouse = { x: 0, y: 0 };

        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function (e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;

            ctx.strokeStyle = this.penColor;
        }, false);


        /* Drawing on Paint App */
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.penColor;

        canvas.addEventListener('mousedown', function (e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', function () {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

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
                root.socket.emit('drawing-data-to-server', { name: root.name, base64DataImage })
            }, 1000)
        };
    }

    allUsers (users) {
        console.log(users)
        this.onlineUsers = users;
    }

    render() {

        return (
            <div className="sketch" id="sketch">

                <div style={{ display: "flex", height: "40px", width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "0 20px" }}>select color </div>
                    <input style={{ margin: "5px" }} type="color" onChange={(e) => { this.penColor = e.target.value; this.updateColor() }} />
                    <button style={{ margin: "5px" }} onClick={() => this.drawRect()}>rectangle</button>
                    <button style={{ margin: "5px" }} onClick={() => this.drawCircle()}>circle</button>
                </div>

                <EventWatch allUsers={this.allUsers}/>

                {/* <OnlineUsers users={this.onlineUsers}/> */}

                <canvas id="board" style={{ height: "calc(100% - 50px)", width: "100%", backgroundColor: "#f0ffff" }}></canvas>
            </div>
        )
    }
}

export default Board