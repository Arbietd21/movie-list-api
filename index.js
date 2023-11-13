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
        name: 'AJ',
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

app.get('/movies', (req, res) => {
    res.json(movies)
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/documentation.html')
});

app.get('/movies/:movieTitle', (req, res) => {
    res.json(movies.find((movie) => {return movie.title === req.params.movieTitle}));
});

app.get('/movies/genres/:genreName', (req, res) => {
    res.json(movies.filter((movie) => {return movie.genre === req.params.genreName}));
});

app.get('/movies/directors/:directorName', (req, res) => {
    res.json(movies.find((movie) => {return movie.director.name === req.params.directorName}));
});

app.post('/users', (req, res) => {
    res.send('Successful POST request, adding a new user to the database');
});

app.put('/users/username', (req, res) => {
    res.send('Username was successfully updated');
});

app.put('/users/username/favorites', (req, res) => {
    res.send('A movie was successfully added to your favorites');
});

app.delete('/users/username/favorites', (req, res) => {
    res.send('A movie was successfully deleted from your favorites');
});

app.delete('/users', (req, res) => {
    res.send('You were successfully deregistered from our database')
})

app.listen(8080, () => {
    console.log(`Your app is listening on port 8080`)
});