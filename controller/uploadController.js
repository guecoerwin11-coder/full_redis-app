const path = require('path')

const singleUpload = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }
    res.status(200).json({ 
        message: 'File uploaded successfully', 
        file: req.file.filename,
        url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    })
}

const multipleUpload = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' })
    }
    const fileNames = req.files.map(file => file.filename)
    res.status(200).json({ message: 'Files uploaded successfully', files: fileNames })
}

module.exports = {
    singleUpload,
    multipleUpload
}