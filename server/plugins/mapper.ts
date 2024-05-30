import mapper from "mybatis-mapper"

export default defineNitroPlugin((nitroApp) => {
    // mapper load
    mapper.createMapper(
        ['server/query/user.xml']
    )
})