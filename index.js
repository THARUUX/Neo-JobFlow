const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const { parse } = require('querystring');
require('dotenv').config();
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 3000;

const app = express();

const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBDATABASE
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id', connection.threadId);
});

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/upload', (req, res) => {
    const { jobNo, bookName, customer } = req.body;

    if (!jobNo || !bookName || !customer) {
        return res.status(400).json({ error: 'Please provide jobNo, bookName, and customer' });
    }

    const status = 0;
    const query = `INSERT INTO jobs (jobNo, bookName, customer, status) VALUES (?, ?, ?, ?)`;

    connection.query(query, [jobNo, bookName, customer, status], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Failed to insert data' });
        }

        res.status(200).json({ message: 'Data inserted successfully', jobId: results.insertId });
    });
});

app.get('/api/jobs', (req, res) => {
    const query = 'SELECT * FROM jobs';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Failed to retrieve data' });
        }

        res.status(200).json(results);
    });
});

app.get('/api/job/:id', (req, res) => {
    const jobId = req.params.id;
    const query = 'SELECT * FROM jobs WHERE id = ?';

    connection.query(query, jobId , (err, results) => {
        if (err) {
            console.error('Error fetching job:', err);
            return res.status(500).json({ error: 'Failed to retrieve job' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.status(200).json(results[0]);
    });
});

app.post('/api/update-job-status', (req, res) => {
    const { id, ...statusUpdates } = req.body;

    const query = `
        UPDATE jobs 
        SET ${Object.keys(statusUpdates).map(key => `${key} = ?`).join(', ')}
        WHERE id = ?
    `;
    const values = [...Object.values(statusUpdates), id];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error updating job status:', err);
            return res.status(500).json({ error: 'Failed to update job status' });
        }
        res.status(200).json({ message: 'Job status updated successfully' });
    });
});

app.post('/api/update-job', (req, res) => {
    const { id, jobNo, bookName, customer } = req.body;

    const query = `
        UPDATE jobs 
        SET jobNo = ?, bookName = ?, customer = ?
        WHERE id = ?
    `;
    const values = [jobNo, bookName, customer, id];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error updating job status:', err);
            return res.status(500).json({ error: 'Failed to update job ' });
        }
        res.status(200).json({ message: 'Job updated successfully' });
    });
});

app.post('/api/delete-job', (req, res) => {
    const { id } = req.body;

    const query = `
        DELETE FROM jobs
        WHERE id = ?
    `;
    const values = [ id];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error updating job status:', err);
            return res.status(500).json({ error: 'Failed to update job ' });
        }
        res.status(200).json({ message: 'Job delete successfully' });
    });
});


app.get('/:id', (req, res) => {
    const askFor = req.params.id + '.html';
    
    res.sendFile(path.join(__dirname, 'public', askFor), (err) => {
        if (err) {
            res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
        }
    });
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'neo@jobflow#1234',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));


let users = [
    {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('neo1234', 10) // Hashing the password before storing it
    }
];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user) {
        //console.log('User found:', user); // Debugging
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                //console.log('Password match'); // Debugging
                req.session.user = { id: user.id, username: user.username };
                res.redirect('/index');
            } else {
                //console.log('Password does not match'); // Debugging
                res.redirect('/login?error=Invalid credentials');
            }
        });
    } else {
        //console.log('User not found'); // Debugging
        res.redirect('/login?error=Invalid credentials');
    }
});

/*app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/index'); 
    } else {
        res.redirect('/login'); 
    }
});

app.get('/:id', (req, res) => {
    if (!req.params.id){
        res.redirect('/index');
    } else if (req.params.id === 'logout'){
        req.session.destroy(err => {
            if (err) {
                return res.status(500).send('Failed to logout');
            }
            res.clearCookie('connect.sid');
            res.redirect('/login');
        }); 
    } else if (req.params.id === 'login'){
        res.sendFile(path.join(__dirname, 'public', 'login.html'), (err) => {
            if (err) {
                res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
            }
        });
    } else if (req.session.user) {
        const askFor = req.params.id + '.html';
        res.sendFile(path.join(__dirname, 'public', askFor), (err) => {
            if (err) {
                res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
            }
        });
    } else {
        res.redirect('/login');
    }
});*/


app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; 
