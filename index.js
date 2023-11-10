let express = require('express');
let app = express();
let morgan = require('morgan');
let bodyParser = require('body-parser');
let methodOverride = require('method-override');

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
    res.json(topMovies)
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/documentation.html')
});

app.listen(8080, () => {
    console.log(`Your app is listening on port 8080`)
});