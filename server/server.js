const path = require("path");
const express = require("express");
const app = express();
const port = 3000;

const shoppingCartController = require("./controllers/shoppingCartController");
app.use(express.json());
app.use(express.urlencoded())

app.use(express.static(path.resolve(__dirname, '../client')));


app.get("/", (req, res) =>res.sendFile(path.resolve(__dirname, "../client/index.html")));

app.get("/signup", (req, res) => res.sendFile(path.resolve(__dirname, "./../client/signup.html")));

app.post("/signup", shoppingCartController.createUser, (req, res) => res.redirect('/'));

app.post("/login", shoppingCartController.verifyUser, (req, res) => res.redirect('/'));

app.put("/api/shoppingCart", (req, res) => res.json({ message: "successful put request" }));

app.post("/api/shoppingCart", (req, res) => res.send("successful post request"));

app.delete("/api/shoppingCart", (req, res) => res.send("successful delete request"));

app.get("/api/shoppingCart", (req, res) => res.send("successful get request"));

// Global error handler
app.use(function (err,req,res,next){
  // console.log(err)
  const defaultErr = {
    log: `Middlewear error`,
    status: 400,
    message:{err: 'Sorry, something went wrong on our server'}
  }
  const errorObj = Object.assign({}, defaultErr,err)
  console.log(errorObj.log)
  res.status(errorObj.status).json(errorObj.message)
})

app.listen(port, () => console.log(`server listening on port ${port}`));

module.exports = app;
