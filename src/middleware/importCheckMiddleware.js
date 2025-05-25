import multer from 'multer';

// Configuración de multer
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos CSV'));
    }
  }
});

// Exportar el middleware
export const importCheckMiddleware = upload.single('file');