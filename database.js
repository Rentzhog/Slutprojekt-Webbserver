import mysql from 'mysql2'

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Emilbff1',
    database: 'rentzhive'
}).promise();

export async function getAllUsers(){
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
}

export async function getUser(id){
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
    return rows[0];
}

export async function getAllPosts(){
    const [rows] = await pool.query("SELECT * FROM posts");
    return rows;
}

export async function getPost(id){
    const [rows] = await pool.query(`SELECT * FROM posts WHERE id = ${id}`);
    return rows[0];
}

export async function getAllComments(){
    const [rows] = await pool.query("SELECT * FROM comments");
    return rows;
}

export async function getComment(id){
    const [rows] = await pool.query(`SELECT * FROM comments WHERE id = ${id}`);
    return rows[0];
}

export async function getCommentsUnderPost(id){
    const [rows] = await pool.query(`SELECT * FROM comments WHERE postId = ${id}`);
    return rows;
}

export async function addUser(username, password, email){
    let sql = `INSERT INTO users (username, password, email) VALUES ('${username}', '${password}', '${email}')`;
    const [result] = await pool.query(sql);
    return getUser(result.insertId)
}

export async function addPost(userID, title, content, imagePath){
    let sql = `INSERT INTO posts (userID, title, content, imagePath) VALUES (${userID}, '${title}', '${content}', '${imagePath}')`;
    const [result] = await pool.query(sql);
    return getPost(result.insertId)
}

export async function addComment(userID, postID, content){
    let sql = `INSERT INTO comments (userID, postID, content) VALUES ('${userID}', '${postID}', '${content}')`;
    const [result] = await pool.query(sql);
    return getComment(result.insertId)
}
