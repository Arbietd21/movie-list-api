let express = require('express');
let app = express();

let morgan = require('morgan');

let topMovies = [
    {
        title: 'Creed',
        actor: 'Michael B. Jordan'
    },
    {
        title: 'Gran Turismo',
        actor: 'Archih Madekwe'
    },
    {
        title: 'Fast and Furious',
        actor: 'Paul Walker'
    },
    {
        title: 'Iron Man',
        actor: 'Robert Downy Jr'
    },
    {
        title: 'Coach Carter',
        actor: 'Samuel Jackson'
    },
    {
        title: 'Thor Ragnarok',
        actor: 'Chris Hemsworth'
    },
    {
        title: 'Rush Hour',
        actor: 'Jackie Chan'
    },
    {
        title: 'Training Day',
        actor: 'Denzel Washington'
    },
    {
        title: 'Hitch',
        actor: 'Will Smith'
    },
    {
        title: 'Hunger Games',
        actor: 'Jennifer Lawrence'
    },
];

app.use(morgan('common'));
app.use(express.static('public'));

app.get('/movies', (req, res) => {
    res.json(topMovies)
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/documentation.html')
});

app.listen(8080, () => {
    console.log(`Your app is listening on port 8080`)
});