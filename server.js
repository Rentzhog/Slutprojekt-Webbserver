import express from 'express'
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt'
import passport from 'passport';
import session from 'express-session';
import local from 'passport-local'
import http from 'http'
import { Server as SocketIOServer } from 'socket.io';

const LocalStrategy = local.Strategy;

import {getAllUsers, getUser, getAllComments, getComment, getAllPosts, getPost, addUser, addPost, addComment, getCommentsUnderPost} from './database.js'

const app = express();
app.use(express.static("./hemsida"));
app.use(bodyParser.urlencoded({extended: true, limit: "50mb", parameterLimit: 50000}));

app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

const server = http.createServer(app)
const io = new SocketIOServer(server)


passport.use(new LocalStrategy(
    async function(username, password, done){
        const users = await getAllUsers();
        const user = users.find(u => u.username.toLowerCase() == username.toLowerCase());
        if(user == null){
            return done(null, false)
        }
        try {
            if(await bcrypt.compare(password, user.password)){
                io.emit("login");
                return done(null, user)
            }else{
                return done(null, false)
            }
        }catch {
            return done(err)
        }
    }
))

passport.serializeUser(function(user, done){
    done(null, user.id)
})


passport.deserializeUser(async function(id, done){
    const user = await getUser(id)
    if(user){
        done(null, user);
    }else{
        done(null, false)
    }
})

let currentPage = null

app.get("/currentpost", (req, res) => {
    res.send(currentPage);
});

app.post("/currentpost", async (req, res) => {
    currentPage = await getPost(req.body.id);
    res.sendStatus(200);
});

app.post("/login", passport.authenticate('local'), function(req, res) {
    res.redirect("/profile");
});

app.post("/logout", function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
        io.emit("logout");
        res.redirect('/');
    });
  });

app.get("/profile", (req, res) => {
    if(req.user){
        const currentUser = req.user
        res.send(currentUser)
    }else{
        res.send(null)
    }

});


app.get("/users", async (req, res) => {
    const users = await getAllUsers()
    res.send(users);
});

app.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const user = await getUser(id);
    res.send(user);
});

app.get("/posts", async (req, res) => {
    const posts = await getAllPosts()
    res.send(posts);
});

app.get("/posts/:id", async (req, res) => {
    const id = req.params.id;
    const post = await getPost(id);
    res.send(post);
});

app.get("/posts/:id/comments", async (req, res) => {
    const id = req.params.id;
    const comments = await getCommentsUnderPost(id);
    res.send(comments);
});

app.get("/comments", async (req, res) => {
    const comments = await getAllComments()
    res.send(comments);
});

app.get("/comments/:id", async (req, res) => {
    const id = req.params.id;
    const comment = await getComment(id);
    res.send(comment);
});

app.post("/users", async (req, res) => {
    const userInfo = req.body;
    const users = await getAllUsers()
    const duplicate = users.find(u => (u.username == userInfo.username || u.email == userInfo.email))

    if(duplicate){
        return res.send()
    } else {
        const hashedPassword = await bcrypt.hash(userInfo.password, 1);
        const user = await addUser(userInfo.username, hashedPassword, userInfo.email);
        return res.send(user);
    }
})

app.post("/posts", async (req, res) => {
    const postInfo = req.body;
    const post = await addPost(postInfo.userID, postInfo.title, postInfo.content, postInfo.image);
    io.emit("post", post);
    res.send(post);
})

app.post("/comments", async (req, res) => {
    const commentInfo = req.body;
    const comment = await addComment(commentInfo.userID, commentInfo.postID, commentInfo.content);
    io.emit("comment", comment);
    res.send(comment);
})

server.listen(3000, () => {
    console.log("Servern är igång på: http://localhost:3000")
});