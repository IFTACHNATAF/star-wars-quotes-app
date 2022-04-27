
const express = require('express');
const bodyParser= require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(express.static('img'))


const MongoClient = require('mongodb').MongoClient

const url = 'mongodb://127.0.0.1:27017'

const dbName = 'iftach'


MongoClient.connect(url, {
    useUnifiedTopology: true
}, (err, client) => {
    const db = client.db(dbName)
    const quotesCollection = db.collection('quotes')
    app.set('view engine', 'ejs')

    app.listen(3000, function(){
        console.log('listening on 3000')

    })



    app.get('/', (req, res) => {
         db.collection('quotes').find().toArray().then(results => {
        res.render('index.ejs', {quotes: results})

         }).catch(error => console.error(error))

        // ...
    })

    app.post('/quotes', (req, res) => {

        quotesCollection.insertOne(req.body)
            .then(result => {
                res.redirect('/')
            })
            .catch(error => console.error(error))

    })

    app.put('/quotes', (req, res) => {
        quotesCollection.findOneAndUpdate(
            { name: 'Yoda' },
            {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }
            },
            {
                upsert: true
            }
        )
            .then(result => {
                res.json('Success')
            })
            .catch(error => console.error(error))
    })

    app.delete('/quotes', (req, res) =>{
        quotesCollection.deleteOne(
            {name : req.body.name}
        ).then(result => {
            if (result.deletedCount === 0) {
                return res.json('No quote to delete')
            }
            res.json(`Deleted Darth Vadar's quote`)
        })
            .catch(error => console.error(error))
    })

    app.delete('/quotesClear', (req, res) =>{
        quotesCollection.deleteMany(
            req.body.all
        ).then(result => {
            if (result.deletedCount === 0) {
                return res.json('No quote to delete')
            }
            res.json(`Deleted Darth Vadar's quote`)
        })
            .catch(error => console.error(error))
    })

    if (err) return console.error(err)
    console.log('Connected to Database')
})