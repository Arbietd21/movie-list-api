const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
// mongoose.connect('mongodb://localhost:27017/careerFoundryDB', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'careerFoundryDB' });


let express = require('express');
let app = express();
let morgan = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application doesn\'t allow acces from origin' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport')

const { check, validationResult } = require('express-validator');

//return a list of movies  
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//display documentation.html
app.get('/', (req, res) => {
    res.send('Welcome to my API!')
});


//return a specific movie
app.get('/movies/:movieTitle', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ title: req.params.movieTitle })
        .then((movie) => {
            res.status(201).json(movie);
        })
        .catch((error) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});


//find movies by genre
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find({ "genre.name": req.params.genreName })
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((error) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

//find director info by name
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find({ "director.name": req.params.directorName })
        .then((director) => {
            res.status(200).json(director);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + err);
        })
});

//return a list of all users
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//find specific user by username
app.get('/users/:userName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ username: req.params.userName })
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//adds new user
app.post('/users', [
    check('username', 'Username is required').isLength({ min: 5 }),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required.').isLength({ min: 8 }),
    check('email', 'Email does not appear to be valid.').isEmail()
], async (req, res) => {
    console.log('Request Body:', req.body);

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.password);
    await Users.findOne({ username: req.body.username }) //searches the db to see if the username already exists
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.username + ' already exists');
            } else {
                Users.create({
                    username: req.body.username,
                    password: hashedPassword,
                    email: req.body.email,
                    birthday: req.body.birthday
                })
                    .then((user) => {
                        console.log('Hashed password:', hashedPassword);
                        res.status(201).json(user);
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//update users info
app.put('/users/:username', [
    check('username', 'username is required').isLength({ min: 5 }),
    check('username', 'username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'password is required.').isLength({ min: 8 }),
    check('email', 'email does not appear to be valid.').isEmail()
], passport.authenticate('jwt', { session: false }), async (req, res) => {

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    if (req.user.username !== req.params.username) {
        return res.status(400).send('Permission Denied');
    }

    await Users.findOneAndUpdate({ username: req.params.username }, {
        $set:
        {
            username: req.body.username,
            password: Users.hashPassword(req.body.password),
            email: req.body.email,
            birthday: req.body.birthday
        }
    },
        { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

//adds a movie to users list of favorite movies
app.post('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {

    if (req.user.username !== req.params.username) {
        return res.status(400).send('Permission Denied');
    }

    await Users.findOneAndUpdate({ username: req.params.username }, {
        $push: { favorites: req.params.MovieID }
    },
        { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

//deletes a movie from users list of favorite movies
app.delete('/users/:username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {

    if (req.user.username !== req.params.username) {
        return res.status(400).send('Permission Denied');
    }

    await Users.findByIdAndDelete({ username: req.params.username }, {
        $delete: { favorites: req.params.MovieID }
    },
        { new: true })
        .then((updatedUser) => {
            res.json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

//deletes a user from list of users
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), async (req, res) => {

    if (req.user.username !== req.params.username) {
        return res.status(400).send('Permission Denied');
    }

    await Users.findOneAndDelete({ username: req.params.username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.username + ' was not found.');
            } else {
                res.status(200).send(req.params.username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on port ' + port);
});
