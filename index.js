let express = require('express');
let app = express();
let morgan = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');

let movies = [
    {
        title: 'Creed',
        actor: 'Michael B. Jordan',
        genre: 'action',
        director: {
            name: 'Ryan Coogler',
            bio: 'American Filmmaker known for moives like Black Panther and Fruitvale Station',
            birthYear: '1986',
        }
    },
    {
        title: 'Gran Turismo',
        actor: 'Archih Madekwe',
        genre: 'action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Fast and Furious',
        actor: 'Paul Walker',
        genre: 'action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Iron Man',
        actor: 'Robert Downy Jr',
        genre: 'action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Coach Carter',
        actor: 'Samuel Jackson',
        genre: 'drama',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Thor Ragnarok',
        actor: 'Chris Hemsworth',
        genre: 'action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Rush Hour',
        actor: 'Jackie Chan',
        genre: 'comedy',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Training Day',
        actor: 'Denzel Washington',
        genre: 'drama',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Hitch',
        actor: 'Will Smith',
        genre: 'comedy',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Hunger Games',
        actor: 'Jennifer Lawrence',
        genre: 'action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
];

let users = [
    {
        name: 'aj',
        favorites: ['creed', 'coach carter', 'fast and furious']
    },
    {
        name: 'Olivia',
        favorites: ['creed', 'coach carter', 'fast and furious']
    },
    {
        name: 'dyan',
        favorites: ['creed', 'coach carter', 'fast and furious']
    },
    {
        name: 'phil',
        favorites: ['creed', 'coach carter', 'fast and furious']
    }
]

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
app.get('/movies', (req, res) => {
    res.json(movies)
});

//display documentation.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/documentation.html')
});


//return a specific movie
app.get('/movies/:movieTitle', (req, res) => {
    res.json(movies.find((movie) => {return movie.title === req.params.movieTitle}));
});


//find movies by genre
app.get('/movies/genres/:genreName', (req, res) => {
    res.json(movies.filter((movie) => {return movie.genre === req.params.genreName}));
});

//find director info by name
app.get('/movies/directors/:directorName', (req, res) => {
    res.json(movies.find((movie) => {return movie.director.name === req.params.directorName}));
});


//find specific user by username
app.get('/users/:userName', (req, res) => {
    res.json(users.find((user) => {return user.name === req.params.userName}));
});

//adds new user
app.post('/users', (req, res) => {
    let newUser = req.body;

    app.post(newUser);
});

//update users name
app.put('/users/:username', (req, res) => {
    let oldUsername = users.find((user) => {return user.name === req.params.username});
    let newUsername = req.body;

    if (newUsername) {
        oldUsername.name = newUsername;
        console.log(success);
    } else {
        console.log('Error user not found');
    }
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
    let movie = username.favorites.filter((m) => {return m.favorites != req.params.movie});

    res.json(users);
});

//deletes a user from list of users
app.delete('/users/deregister/:username', (req, res) => {
    res.send(users.filter((user) => {return user.name != req.params.username}));
});

app.listen(8080, () => {
    console.log(`Your app is listening on port 8080`)
});