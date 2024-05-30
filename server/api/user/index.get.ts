import { read } from "../../db"
import mapper from "mybatis-mapper"
import type { RowDataPacket } from 'mysql2'

export default defineEventHandler(async (event) => {
  const { page, itemsPerPage, search, sortBy } = getQuery(event) as any
  let keyword, hits
  if(search != undefined) {
    let obj = JSON.parse(search)
    keyword = obj.keyword
    hits = obj.hits
  }

  let start
  if(page != undefined && itemsPerPage != -1) {
    start = (page - 1) * itemsPerPage
  }

  let sortKey, sortOrder
  if (sortBy != undefined) {
    let obj = JSON.parse(sortBy)
    sortKey = obj.key
    sortOrder = obj.order
  }

  var dbQuery = mapper.getStatement('user', 'getList', { sortKey, sortOrder, keyword, hits, start, itemsPerPage })
  const [rows] = await read.query<RowDataPacket[]>(dbQuery)

  dbQuery = mapper.getStatement('user', 'getTotal', { keyword })
  const [result] = await read.query<RowDataPacket[]>(dbQuery)
  return {
    items: rows,
    total: result[0].total
  }
})