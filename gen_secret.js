const crypto = require('crypto')
const fs = require('fs')
const secret = crypto.randomBytes(256).toString('hex')

fs.writeFileSync('./secret.txt', secret)
