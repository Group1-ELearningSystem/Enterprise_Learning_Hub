import multer from "multer"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "video") {
            cb(null, "uploads/videos")
        } 
        else if (file.fieldname === "pdf") {
            cb(null, "uploads/documents")
        }

    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname
        cb(null, uniqueName)
    }
})

export const upload = multer({ storage })