const postTemplate = document.querySelector("[post-template]");
const postContainer = document.querySelector("[post-container]");
const searchInput = document.querySelector("[data-search]");
const newPostBut = document.querySelector("#new-post-button")

let socket = io();

$(() => {
    $.get("http://localhost:3000/profile", (data) => {
        if(data){
            newPostBut.href="new-post.html";
        }
    })


    
    socket.on("post", addPost)
    
    showAllPosts()
    
    searchInput.addEventListener("input", (e) => {
        const value = e.target.value.toLowerCase();
        if(value == ""){return}
        $(postContainer).children().each(function () {
            $.get("http://localhost:3000/posts/" + this.getAttribute("data-post-id").toString(), post => {
                const isVisible = post.title.toLowerCase().includes(value) || post.content.toLowerCase().includes(value)
                this.classList.toggle("hide", !isVisible)
            })
        })
    })
    
    document.addEventListener("click", () => {
        $(postContainer).children().each(function () {
            this.classList.toggle("hide", false)
            searchInput.value = ""
        })
    })
})

function addPost(post){
    const newPost = postTemplate.content.cloneNode(true).children[0];
    const title = newPost.querySelector("[data-title]");
    const content = newPost.querySelector("[data-content]");
    const image = newPost.querySelector("[data-image]");
    const user = newPost.querySelector("[data-user]");

    title.textContent = post.title;
    content.textContent = post.content;
    newPost.setAttribute("data-post-id", post.id);

    $.get("http://localhost:3000/users/" + post.userID.toString(), data => {
        user.textContent = "Posted by @" + data.username.toLowerCase() + " - " + post.createdAt.slice(0, 10);;
    })


    if(post.imagePath != ""){
        image.src = post.imagePath
    } else {
        console.log("5eer")
        image.remove()
    }

    postContainer.prepend(newPost);
    newPost.addEventListener("click", function(){
        $.post("http://localhost:3000/currentpost", {id: newPost.getAttribute("data-post-id")}, function(){
            window.location.replace("post.html");
        })
    })
}

function showAllPosts(){
    $.get("http://localhost:3000/posts", (data) => {
        let posts = data.map(post => {
            const newPost = postTemplate.content.cloneNode(true).children[0];
            const title = newPost.querySelector("[data-title]");
            const content = newPost.querySelector("[data-content]");
            const image = newPost.querySelector("[data-image]");
            const user = newPost.querySelector("[data-user]");

            title.textContent = post.title;
            content.textContent = post.content;
            newPost.setAttribute("data-post-id", post.id);

            $.get("http://localhost:3000/users/" + post.userID.toString(), data => {
                user.textContent = "Posted by @" + data.username.toLowerCase() + " - " + post.createdAt.slice(0, 10);;
            })


            if(post.imagePath != ""){
                image.src = post.imagePath
            } else {
                image.remove()
            }

            postContainer.prepend(newPost);
            newPost.addEventListener("click", function(){
                $.post("http://localhost:3000/currentpost", {id: newPost.getAttribute("data-post-id")}, function(){
                    window.location.replace("post.html");
                })
            })
        })
        return posts
    })
}