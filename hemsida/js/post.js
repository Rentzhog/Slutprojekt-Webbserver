
const commentTemplate = document.querySelector("[comment-template]");
const commentContainer = document.querySelector("[comment-container]");
const postTitle = document.querySelector(".post-title");
const postImg = document.querySelector(".post-image");
const postContent = document.querySelector(".post-content");
const userText = document.querySelector(".post-user");

let socket = io();

socket.on("comment", addComment)

showPostAndComments()

$(() =>{
    $("#comment-bar button").click(() => {
        $.get("http://localhost:3000/profile", (user) => {
            if(user){
                if($("#comment-bar input").val() != ""){
                    $.get("http://localhost:3000/currentpost", (post) => {
                        createComment(user.id, post.id, $("#comment-bar input").val());
                        $("#comment-bar input").val("");
                    })
                }
            }else{
                window.location.replace("signup.html");
            }
        })
    });

});


function addComment(comment){
    $.get("http://localhost:3000/currentpost", (post) => {
        if(post){
            const newComment = commentTemplate.content.cloneNode(true).children[0];
            const username = newComment.querySelector("[data-user]");
            const content = newComment.querySelector("[data-content]");
            const date = newComment.querySelector("[data-date]");

            content.textContent = comment.content;
            date.textContent = comment.createdAt.slice(0, 10)

            $.get("http://localhost:3000/users/" + comment.userID.toString(), data => {
                username.textContent = "@" + data.username.toLowerCase();
            })

            commentContainer.prepend(newComment);
        }else{
            window.location.replace("index.html");
        }
    });
}

function createComment(userID, postID, content){
    $.post("http://localhost:3000/comments", {userID: userID, postID: postID, content: content});
}

function showPostAndComments(){
    $.get("http://localhost:3000/currentpost", (post) => {
        if(post){
            postID = post.id

            postTitle.textContent = post.title
            postContent.textContent = post.content

            $.get("http://localhost:3000/users/" + post.userID.toString(), data => {
                userText.textContent = "Posted by @" + data.username.toLowerCase() + " - " + post.createdAt.slice(0, 10);;
            })


            if(post.imagePath != ""){
                postImg.src = post.imagePath
            } else {
                postImg.remove()
            }

            $.get("http://localhost:3000/posts/" + postID.toString() + "/comments", (data) => {
                posts = data.map(comment => {
                    const newComment = commentTemplate.content.cloneNode(true).children[0];
                    const username = newComment.querySelector("[data-user]");
                    const content = newComment.querySelector("[data-content]");
                    const date = newComment.querySelector("[data-date]");
        
                    content.textContent = comment.content;
                    date.textContent = comment.createdAt.slice(0, 10)
        
                    $.get("http://localhost:3000/users/" + comment.userID.toString(), data => {
                        username.textContent = "@" + data.username.toLowerCase();
                    })
        
                    commentContainer.prepend(newComment);
                })
            })
        }else{
            window.location.replace("index.html");
        }
    })
}