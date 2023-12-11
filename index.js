const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
// mongoose.connect('mongodb://localhost:27017/careerFoundryDB', {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('process.env.CONNECTION_URI', {useNewUrlParser: true, useUnifiedTopology: true });


let express = require('express');
let app = express();
let morgan = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
    origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
        let message = 'The CORS policy for this application doesn\'t allow acces from origin' + origin;
        return callback(new Error(message), false);
    }
    return callback(null, true);
} 
}));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport')

const {check, validationResult } = require('express-validator');

//return a list of movies  
app.get('/movies', passport.authenticate('jwt', {session: false}), async (req, res) => {
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
app.get('/movies/:movieTitle', passport.authenticate('jwt', {session: false}), async (req, res) => {
   await Movies.findOne({ Title: req.params.movieTitle })
   .then((movie) => {
    res.status(201).json(movie);
   })
   .catch((error) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
   })
});


//find movies by genre
app.get('/movies/genres/:genreName', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Movies.find({ "Genre.Name": req.params.genreName})
    .then ((movies) => {
        res.status(201).json(movies);
    })
    .catch((error) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

//find director info by name
app.get('/movies/directors/:directorName', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Movies.find({ "Director.Name": req.params.directorName})
    .then ((director) => {
        res.status(200).json(director);
    })
    .catch((error) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

//return a list of all users
app.get('/users', passport.authenticate('jwt', {session: false}), async (req, res) => {
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
app.get('/users/:userName', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await Users.findOne({ Username: req.params.userName})
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
    check('Username', 'Username is required').isLength({min:5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').isLength({min:8}),
    check('Email', 'Email does not appear to be valid.').isEmail()
], async (req, res) => {
    console.log('Request Body:', req.body);

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username }) //searches the db to see if the username already exists
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + ' already exists');
        } else {
            Users.create({
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) => {
                console.log('Hashed Password:',  hashedPassword);
                res.status(201).json(user);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

//update users info
app.put('/users/:username', [
    check('Username', 'Username is required').isLength({min:5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required.').isLength({min:8}),
    check('Email', 'Email does not appear to be valid.').isEmail()
], passport.authenticate('jwt', {session: false}), async (req, res) => {

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array() });
    }

    if(req.user.Username !== req.params.username){
        return res.status(400).send('Permission Denied');
    }

    await Users.findOneAndUpdate({ Username: req.params.username }, {
    $set:
    {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
    }
    },
    { new: true})
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

//adds a movie to users list of favorite movies
app.post('/users/:username/movies/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res) => {

    if(req.user.Username !== req.params.username){
        return res.status(400).send('Permission Denied');
    }

    await Users.findOneAndUpdate({ Username: req.params.username }, { $push: { Favorites: req.params.MovieID }
    },
    {new: true})
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

//deletes a movie from users list of favorite movies
app.delete('/users/:username/favorites/:MovieID', passport.authenticate('jwt', {session: false}), async (req, res) => {

    if(req.user.Username !== req.params.username){
        return res.status(400).send('Permission Denied');
    }

    await Users.findByIdAndDelete({ Username: req.params.username }, { $delete: { Favorites: req.params.MovieID }
    },
    {new: true})
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

//deletes a user from list of users
app.delete('/users/:username', passport.authenticate('jwt', {session: false}), async (req, res) => {

    if(req.user.Username !== req.params.username){
        return res.status(400).send('Permission Denied');
    }

    await Users.findOneAndDelete({ Username: req.params.username})
    .then((user) => {
        if (!user){
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

const port = process.env.Port || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on port ' + port);
});
