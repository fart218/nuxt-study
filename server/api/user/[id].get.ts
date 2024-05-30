import { read } from "../../db"
import mapper from "mybatis-mapper"
import type { RowDataPacket } from 'mysql2'

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params!.id) as number

  if (!Number.isInteger(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID should be an integer',
    })
  }

  var dbQuery = mapper.getStatement('user', 'get', { id: id })
  const [rows] = await read.query<RowDataPacket[]>(dbQuery)

  return rows[0]
})