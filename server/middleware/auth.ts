import jwt from "jsonwebtoken"

const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  if(getRequestURL(event).pathname !== '/') {
    try {
      const jwtUserToken = getCookie(event, 'user-jwt')
      const confirm = jwt.verify(jwtUserToken!, runtimeConfig.jwtSecret)
    }
    catch(error) {
      console.log("error")
      await sendRedirect(event, '/', 302)
    }
  } else {
    // login
    var token = jwt.sign(
      {
        name: 'test'
      }
    , runtimeConfig.jwtSecret, { expiresIn: 60*15 })

    setCookie(event, 'user-jwt', token, {
      httpOnly: true, 
      maxAge: 1000000
    })

    console.log('Login success')
  }
})