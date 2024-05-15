// Import express.js
const express = require('express'); 
// Import built-in "path" to resolve path to files located on the server 
const path = require('path'); 
const fs = require('fs'); 

const app = express(); 
const PORT = process.env.PORT || 3001; 

// Import middleware for parsing JSON 
app.use(express.json());  
app.use(express.static('public'));

// GET Route for the notes page 
app.get('/notes', (req, res)=> {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
}); 

// GET Route for the homepage 


// app.get('/assets/css/styles.css', (req, res)=> {
//     res.sendFile(path.join(__dirname, '/public/assets/css/styles.css'));
// });

// API Routes 
app.get('/api/notes', (req, res)=> {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf-8', (err, data)=>{
        if (err) {
            console.error(err); 
            res.status(500).json({error: 'Internal Server Error' });
            return;
        }
        const notes = JSON.parse(data); 
        res.json(notes);
    });
}); 

app.get('*', (req, res)=> {
    res.sendFile(path.join(__dirname, '/public/index.html'));
}); 

app.post('/api/notes', (req, res)=>{
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf-8', (err, data)=>{
        if (err) {
            console.error(err); 
            res.status(500).json({error: 'Internal Server Error'}); 
            return;
        }
        const notes = JSON.parse(data); 
        const newNote = req.body; 
        newNote.id = Date.now();  
        notes.push(newNote); 
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error(err); 
                res.status(500).json({error: 'Internal Server Error'}); 
                return;
            }
            res.json(newNote);
        });
    });
}); 

app.delete("/api/notes/:id", (req, res)=> {
    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf-8', (err, data)=>{
        if (err) {
            console.error(err); 
            res.status(500).json({error: 'Internal Server Error'}); 
            return;
        }
        const notes = JSON.parse(data); 
        
        const idToDelete = req.params.id;
        const result = notes.filter((note) => note.id != idToDelete);
        
        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(result, null, 2), (err) => {
            if (err) {
                console.error(err); 
                res.status(500).json({error: 'Internal Server Error'}); 
                return;
            }
            res.json(result);
        });
    });
})

// Listen for incoming connection on the specified port 
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});