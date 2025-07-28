const express = require('express');
const fileUpload = require('express-fileupload');
const Tesseract = require('tesseract.js-node');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(fileUpload());

app.post('/ocr', async (req, res) => {
  const { pdfUrl } = req.body;
  if (!pdfUrl) {
    return res.status(400).json({ error: 'Missing pdfUrl in body' });
  }

  try {
    const worker = await Tesseract.createWorker();
    await worker.loadLanguage('spa');
    await worker.initialize('spa');
    const { data } = await worker.recognize(pdfUrl);
    await worker.terminate();

    res.json({ texto_extraido: data.text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor OCR funcionando');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});
