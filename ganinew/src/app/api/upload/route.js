import nextConnect from 'next-connect';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Upload error: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(upload.single('file'));

apiRoute.post((req, res) => {
  const filePath = `/uploads/${req.file.filename}`;
  res.status(200).json({ url: filePath });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apiRoute;
