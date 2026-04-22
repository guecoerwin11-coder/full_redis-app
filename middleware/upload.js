const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, 'uploads/')
    },
    filename: (req, file, cd) => {
        const newFile = Date.now() + '- ' + file.originalname
        cd(null, newFile)
    }
})

const fileFilter = (req, file, cd) => {
    const ext = ['.jpg', '.jpeg', '.png', '.gif']
    if (ext.includes(path.extname(file.originalname).toLowerCase())) {
        cd(null, true)
    } else {
        cd(new Error('Only images are allowed'))
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})


module.exports = upload