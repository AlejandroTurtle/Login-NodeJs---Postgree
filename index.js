import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import cadastroRouter from "./routes/usuario.js"
import session from "express-session"


const app = express()

app.set("view engine", "ejs")
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/views', express.static("views"))
app.use(session({
    secret: "0832179327",
    resave: false,
    saveUninitialized: true,
}))
app.use("/", cadastroRouter)





app.listen(3000, () => {
    console.log("API ONLINE")
})