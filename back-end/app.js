const express = require('express');
const dotenv = require('dotenv');
const DB = require('./config/db_config');

const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const openapiSpec = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));

const cookieParser = require('cookie-parser');

const user_router = require('./routes/user.routes')
const post_router = require('./routes/post.routes')

const app = express()

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

DB.connect_to_mongodb()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.get('/', (req, res) => {
    res.send("welcome to insta app")
})

app.use('/user', user_router)
app.use('/post', post_router)

app.listen(4000, () => { console.log("welcome to mongo db server"); });
