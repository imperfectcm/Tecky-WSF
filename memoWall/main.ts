import express from "express";
import expressSession from "express-session";
import path from 'path';
import { authRouter } from "./router/authRouter";
import http from "http";
import { Server as SocketIO } from "socket.io";
import { memoRouter } from "./router/memoRouter";

const PORT = 1874;

declare module "express-session" {
    interface SessionData {
        userId?: number;
        username?: string;
    }
}

export const app = express();
const server = new http.Server(app);
export const io = new SocketIO(server);

io.on("connection", function (socket) {
    // This socket is the specific socket
    socket.emit("hello", { msg: "Hello Client" });

    socket.on('login-success', (userId) => {
        socket.join(`room-${userId}`)
        io.to(`room-${userId}`).emit("redraw-member-page", "Welcome")
    })

    socket.on("upload-memo-success", () => {
        io.emit("redraw-memo-area", "Memowall has been updated")
    })

    socket.on("update-memo-success", () => {
        io.emit("redraw-memo-area", "Memowall has been updated")
    })

    socket.on("delete-memo-success", () => {
        io.emit("redraw-memo-area", "Memowall has been updated")
    })

});



if (process.env.SECRET) {
    app.use(
        expressSession({
            secret: process.env.SECRET,
            resave: true,
            saveUninitialized: true,
        })
    );
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/", authRouter);
app.use("/memo", memoRouter);

app.use(express.static('public'));
app.use(express.static('uploads'));

app.use((req, res) => {
    res.sendFile(path.resolve('./public/404/404.html'))
})

server.listen(PORT, () => {
    console.log(`Server Listening at http://localhost:${PORT}`)
})