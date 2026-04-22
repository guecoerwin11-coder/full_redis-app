const { singleUpload, multipleUpload } = require('../controller/uploadController')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const upload = require('../middleware/upload')

router.post('/single', upload.single('file'), singleUpload)
router.post('/multiple', upload.array('files', 5), multipleUpload)

module.exports = router