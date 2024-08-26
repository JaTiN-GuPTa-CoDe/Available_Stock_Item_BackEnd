const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads')); // Save files in the "uploads" directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Name the file with a timestamp
    }
});

// File filter to allow only specific file types (optional)
const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Initialize multer with storage configuration and file filter
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter, // Optional, can be removed if not needed
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit file size to 5MB (optional)
    }
});

module.exports = upload;
