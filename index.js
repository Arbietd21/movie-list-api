let express = require('express');
let app = express();
let morgan = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');

let movies = [
    {
        title: 'Creed',
        actor: 'Michael B. Jordan',
        genre: 'Action',
        director: {
            name: 'Ryan Coogler',
            bio: 'American Filmmaker known for moives like Black Panther and Fruitvale Station',
            birthYear: '1986',
        }
    },
    {
        title: 'Gran Turismo',
        actor: 'Archih Madekwe',
        genre: 'Action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Fast and Furious',
        actor: 'Paul Walker',
        genre: 'Action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Iron Man',
        actor: 'Robert Downy Jr',
        genre: 'Action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Coach Carter',
        actor: 'Samuel Jackson',
        genre: 'Action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Thor Ragnarok',
        actor: 'Chris Hemsworth',
        genre: 'Action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Rush Hour',
        actor: 'Jackie Chan',
        genre: 'Action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Training Day',
        actor: 'Denzel Washington',
        genre: 'Action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Hitch',
        actor: 'Will Smith',
        genre: 'Action',
        director: {
            name: '',
            bio: '',
            birthYear: '',
        }
    },
    {
        title: 'Hunger Games',
        actor: 'Jennifer Lawrence',
        genre: 'Action',
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
    res.json(movies.find((movie) => {return movie.genre === req.params.genreName}));
});

app.get('/movies/directors/:directorName', (req, res) => {
    res.json(movies.find((movie) => {return movie.director.name === req.params.directorName}));
});

app.listen(8080, () => {
    console.log(`Your app is listening on port 8080`)
});