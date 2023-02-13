const express = require("express");
const app = express();
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

// config for .env file
dotenv.config()

app.use("/static", express.static("public"))
// add data from form to body prop of request!
app.use(express.urlencoded({ extended: true }));


// connection to db using mongoose
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});

app.set("view engine", "ejs");

// #Routing - GET and POST requests differentiated here for each url path, e.g. '/' or '/edit' to carry out corresponding functionality.
app.get('/',(req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

app.post('/', async (req, res) => {
    // creation of new task with content from request
    // #Document - We can create, read, update, and delete instances of the schema we defined for a todoTask as documents.
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        // saving task to db, rerender page to display
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        console.log(err)
        res.redirect("/");
    }
});

// #DynamicURLs - the ID of the todo is included as a request parameter so we can find it in the db
app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
}).post((req, res) => {
    const id = req.params.id;
    // find specified TodoTask in db, update with content of request (should have the new name)
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    // deletion from database after finding task with passed ID
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

