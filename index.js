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
app.get('/movies/genres/:genreName', async (req, res) => {
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
app.get('/movies/directors/:directorName', async (req, res) => {
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

//update users info
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
app.post('/users/:username/movies/:movieID', async (req, res) => {
    await Users.findOneAndUpdate({ username: req.params.username }, {
        $push: { Favorites: req.params.movieID }
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
app.delete('/users/:username', async (req, res) => {
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

app.listen(8080, () => {
    console.log(`Your app is listening on port 8080`)
});