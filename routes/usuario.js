import express, { response } from "express"
import { connect } from "../repository/db.js"
import bcrypt, { hash } from "bcrypt"
import nodemailer from "nodemailer"


const saltRounds = 10

const smtp = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    secureConnection: false,
    auth: {
        user: "suportealejandrog@gmail.com",
        pass: "mwdp ymug qylf buoh8677"

    },
    tls: {
        rejectUnauthorized: true
    }
})


const router = express.Router()



const logado = (req, res, next) => {
    if(!req.session.login) {
        res.redirect("/login")
    } else {
        next()
    }
}

router.get("/", (req, res) =>{
    res.render("home")
})


router.get("/register",(req, res) =>{
    res.render("register")
} )

router.post("/register", async (req, res) => {
    let conn
    try {
        conn = await connect()

        const result = await conn.query("SELECT * FROM usuarios WHERE login = $1", [req.body.email])
        if (result.rowCount === 0) {
            bcrypt.hash(req.body.senha, saltRounds, async (err, hash) => {
                if (err) {
                    console.log("Erro ao gerar hash", err)
                    throw err
                }
                try {
                    const sql = "INSERT INTO usuarios (nome, login, senha) VALUES ($1, $2, $3)"
                    await conn.query(sql, [req.body.nome, req.body.email, hash])  
                    res.redirect("/login")
                    let message = {
                        from: "suportealejandrog@gmail.com",
                        to: req.body.email,
                        subject: "Cadastro realizado com sucesso",
                        html: "Olá, seu cadastro foi realizado com sucesso, obrigado por se cadastrar!",
                      }
                            console.log("Enviando e-mail")
                            await smtp.sendMail(message)
                            console.log("Email enviado")
                        
                } catch (error) {
                    console.error("Erro ao inserir dados no banco de dados", error)
                    throw error
                }
            })     
        } else {
            console.log("Email já existe no banco")
            res.redirect("/register")
            
        }
    } catch (error) {
        throw error
    } finally {
        if (conn)
            conn.release()
    }

})


router.get("/login", (req, res) => {
    res.render("login")
})


router.post("/login", async (req, res) => {
    let conn
    let email = req.body.email.toLowerCase()
    let senha = req.body.senha
    try {
      conn = await connect()
  
      const resultLogin = await conn.query("SELECT login, senha FROM usuarios WHERE login = $1", [email])
      if (resultLogin.rowCount > 0) {
        const usuario = resultLogin.rows[0]
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
        console.log("Senha fornecida:", senha)
        console.log("Senha do banco de dados:", usuario.senha)
        if (senhaCorreta) {
          req.session.login = true
          res.redirect("/profile")
        } else {
          console.log("Senha incorreta")
          res.redirect("/login")
        }
      } else {
        console.log("Usuário não existe")
        res.redirect("/login")
      }
    } catch (error) {
      console.error("Erro no login", error)
    } finally {
      (conn) => conn.release()
    }

    

  })



router.get("/profile", logado, (req, res) =>{
        res.render("profile")
})




export default router
