import jwt from "jsonwebtoken"
import { read, comparePassword } from "../db"
import mapper from "mybatis-mapper"
import type { RowDataPacket } from 'mysql2'

const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  let body = await readBody(event)
  let dbQuery = mapper.getStatement('user', 'findByEmail', body)
  const [confirm] = await read.query<RowDataPacket[]>(dbQuery)

  if(confirm.length < 1) {
    return {
      code : 0,
      description: "Unregistered User Information"
    }
  } else {
    const data = confirm[0];
    if(comparePassword(data.password, body.password)) {

      var token = jwt.sign(
        data
      , runtimeConfig.jwtSecret, { expiresIn: 60*15 })
  
      setCookie(event, 'user-jwt', token, {
        httpOnly: true, 
        maxAge: 1000000
      })

      return {
        code : 1,
        description: "Successful login",
      }
    } else {
      return {
        code : -1,
        description: "passwords do not match"
      }
    }
  }
})
