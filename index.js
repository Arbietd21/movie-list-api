const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/careerFoundryDB', {useNewUrlParser: true, useUnifiedTopology: true });

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

//return a list of movies  
app.get('/movies', async (req, res) => {
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
    res.sendFile(__dirname + '/documentation.html')
});


//return a specific movie
app.get('/movies/:movieTitle', async (req, res) => {
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
app.get('/movies/genres/:genreName', (req, res) => {
    res.json(movies.filter((movie) => {return movie.genre === req.params.genreName}));
});

//find director info by name
app.get('/movies/directors/:directorName', (req, res) => {
    res.json(movies.find((movie) => {return movie.director.name === req.params.directorName}));
});

//return a list of all users
app.get('/users', async (req, res) => {
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
app.get('/users/:userName', async (req, res) => {
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
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users.create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) => {res.status(201).json(user)})
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

//update users name
app.put('/users/:username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.username }, {$set:
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
app.post('/users/:username/favorites', (req, res) => {
    let username = users.find((user) => {return user.name === req.params.username});
    let movie = req.body.movie;

    if (movie) {
        username.favorites.push(movie);
        res.json(username);
    } else {
        res.send("Error");
    }
});

//deletes a movie from users list of favorite movies
app.delete('/users/:username/favorites/:movie', (req, res) => {
    let username = users.find((user) => {return user.name === req.params.username});
    
    if (!username) {
        return res.status(404).send('User not found');
    };

    let originalFavoritesCount = user.favorites.length;
    username.favorites = username.favorites.filter(m => m !== req.params.movie);

    if (user.favorites.length === originalFavoritesCount) {
        return res.status(404).send('Movie not found in favorites');
    };

    res.json(username.favorites);
});

//deletes a user from list of users
app.delete('/users/deregister/:username', (req, res) => {
    let initialLength = users.length;
    users = users.filter(user => user.name !== req.params.username);

    if (users.length === initialLength) {
        return res.status(404).send('User not found');
    }

    res.send('User deleted successfully');
});

app.listen(8080, () => {
    console.log(`Your app is listening on port 8080`)
});