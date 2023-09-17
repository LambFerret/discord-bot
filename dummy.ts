import express from 'express';
import path from 'path';

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'dummy.html'));
});

app.get('/solve' , (req, res) => {
    res.sendFile(path.join(__dirname, 'solve.html'));
});

app.listen(9751, () => {
    console.log('Example app listening on port 3000!');
});

