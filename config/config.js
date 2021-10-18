const PORT_DEV = 4500
const PORT_PRO = 9091
const DB_URI_DEV = "mongodb://localhost:27017/Ecommerce"
const DB_URI_PRO = "mongodb+srv://suraj:suraj@cluster0.6f0cv.mongodb.net/Ecommerce?retryWrites=true&w=majority"
const DEV = true
const JWT_SECRET = "thbrwgbwjkbasdjfobdafjdbfjdfbdkdgdgdgdsgdsgdsg"
const JWT_EXPIRE = "5d"
const COOKIE_EXPIRE = 5
const SMPT_SERVICE = "gmail"
const SMPT_HOST = "smtp.gmail.com"
const SMPT_PORT= 465
const SMPT_MAIL = "suraj.rama.yadav02@gmail.com"
const SMPT_PASSWORD = "ankitramayadav"
const REDIS_EXPIRE=3600

const CLOUD_APIKEY="171379643657393"
const CLOUD_SECRET="DqgMcG9WQkCwOoATg0EdKGVh3VA"
const CLOUD_NAME="surajyadav"


module.exports = { PORT_DEV, PORT_PRO, DB_URI_DEV, DB_URI_PRO, DEV, JWT_EXPIRE, JWT_SECRET, COOKIE_EXPIRE ,SMPT_SERVICE,SMPT_MAIL,SMPT_PASSWORD,SMPT_PORT,SMPT_HOST,REDIS_EXPIRE,CLOUD_APIKEY,CLOUD_SECRET,CLOUD_NAME}