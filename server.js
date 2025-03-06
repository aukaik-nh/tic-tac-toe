const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// ใช้ folder "public" สำหรับไฟล์ static (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// เริ่มต้นเซิร์ฟเวอร์
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// เริ่มเซิร์ฟเวอร์ที่ port 3000
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
