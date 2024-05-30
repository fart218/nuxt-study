import { write } from "../../db"
import mapper from "mybatis-mapper"
import type { RowDataPacket } from 'mysql2'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  var dbQuery = mapper.getStatement('user', 'update', body)
  const [result] = await write.query<RowDataPacket[]>(dbQuery)
  return result
})
