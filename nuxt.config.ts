export default defineNuxtConfig({
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },

  devtools: { enabled: true },
  runtimeConfig: {
    // The private keys which are only available server-side
    mysqlReadHost: '127.0.0.1',
    mysqlReadPort: '3306',
    mysqlReadUser: 'root',
    mysqlReadPassword: 'root',
    mysqlReadDatabase: 'mydb',

    mysqlWriteHost: '127.0.0.1',
    mysqlWritePort: '3306',
    mysqlWriteUser: 'root',
    mysqlWritePassword: 'root',
    mysqlWriteDatabase: 'mydb',

    jwtSecret: 'my@#$secret',
  }
})
