/**********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Brady Rhora Student ID: 157116203 Date: 01/15/2023
*  Cyclic Link: https://peach-lobster-gown.cyclic.app
*
********************************************************************************/ 

const HTTP_PORT = process.env.PORT || 8080;
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MoviesDB = require('./modules/moviesDB.js');

const db = new MoviesDB();
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req,res) =>{
    res.json({message:"API Listening"});
});

app.post('/api/movies', (req,res)=>{
    try {
        let data = req.body;
        db.addNewMovie(data).then(()=>{
            res.status(201);
            res.json({message:"Movie successfully added"});
        });
    } catch (err) {
        res.status(500);
        res.json({error:"Unable to add movie"})
    }
});

app.get('/api/movies', (req,res)=>{
    let page = req.query.page;
    let perPage = req.query.perPage;
    let title = req.query.title || undefined;

    if (page && perPage) {
        db.getAllMovies(page,perPage,title).then((movies)=>{
            res.json(movies);
        });
    } else {
        res.status(400);
        res.json({error:'Arguments must include page and perPage'});
    }
});

app.get('/api/movies/:id', (req,res)=>{
    let id = req.params.id;
    db.getMovieById(id).then((movie)=>{
        if (movie)
            res.json(movie);
        else {
            res.status(404)
            res.json({error:"Movie with specified ID not found"});
    }}).catch((err)=>{
        if (err.name == 'CastError') res.status(400);
        else res.status(500);

        res.json({error:"Internal server error, unable to retrieve movie"});
    });
});

app.put('/api/movies/:id', (req,res)=>{
    let id = req.params.id;
    let data = req.body;
    if (data) {
        db.updateMovieById(data,id).then(()=>{
            res.status(200)
            res.json({message:"Movie successfully updated"});
        }).catch((err)=>{
            res.status(500)
            res.json({error:"Unable to update movie"});
        });
    } else {
        res.status(400);
        res.json({error:"Movie data must be included in request body"});
    }
});

app.delete('/api/movies/:id', (req,res)=>{
    let id = req.params.id;
    db.deleteMovieById(id).then(()=>{
        res.json({message:"Movie successfully deleted"});
    }).catch((err)=>{
        if (err.name == 'CastError') res.status(400);
        else res.status(500);

        res.json({error:"Internal server error, unable to delete movie"});
    });
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`Listening on port ${HTTP_PORT}`);
    })
}).catch((err) => {
    console.log(err);
});