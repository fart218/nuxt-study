import { read, write, hashPassword } from "../../db"
import mapper from "mybatis-mapper"
import type { ResultSetHeader, RowDataPacket } from 'mysql2'
import jwt from "jsonwebtoken"

const runtimeConfig = useRuntimeConfig()

export default defineEventHandler(async (event) => {
  let body = await readBody(event)
  let dbQuery = mapper.getStatement('user', 'findByEmail', body)
  const [confirm] = await read.query<RowDataPacket[]>(dbQuery)

  if(confirm.length > 0) {
    return {
      code : 0,
      description: "Already registered information"
    }
  } else {
    body.password = hashPassword(body.password)
    dbQuery = mapper.getStatement('user', 'new', body)
    const [result] = await write.query<ResultSetHeader>(dbQuery)
    var token = jwt.sign(
      { id: result.insertId, ...body }
    , runtimeConfig.jwtSecret, { expiresIn: 60*15 })

    setCookie(event, 'user-jwt', token, {
      httpOnly: true, 
      maxAge: 1000000
    })

    return {
      code : 1,
      description: "Successful registration"
    }
  }
})