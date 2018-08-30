var express = require('express');
var router = express.Router();

import { Player, insertPlayer, findPlayerById, loginPlayer, getAvailablePlayers, updatePlayer, findAllPlayers } from '../models/Player';
import { Game, createNewGame  } from '../models/Game';
import { Piece, addNewPiece, create32Pieces, updatePiece, pieceAattackPieceB  } from '../models/Piece';


router.get('/findAll', async(req, res) => {
    try {
        let allPlayers = await findAllPlayers()
        res.json({
            allPlayers
        })
    }
    catch(error) {
        throw error
    }
})

router.post('/register', async (req,res) => {   
    try {
        let { email, password, name, isplaying, online } = req.body;
        // console.log(`name = ${name}`);
        //Validate

        let newPlayer = await insertPlayer(email, password, name, isplaying, online);                
        if (newPlayer) {
            // socket.emit('server-send-insertSuccess')

            
            res.json({
                status: 'ok',
                data: newPlayer,
                message: "Create new Player success"
            })
        } else {
            // socket.emit('server-send-insertFail')
                
            res.json({
                status: 'false',
                data: {},
                message: "Create new Player failed"
            })    
        }                
    } 
    catch(error) {
        res.json({
            status: 'false',
            data: {},
            message: "Create new Player failed. error "+error
        })
    }

})
router.post('/login', async (req,res) => {   
    try {
        let { email, password } = req.body;
        //Validate
        let loggedPlayer = await loginPlayer(email, password);                
        if (loggedPlayer) {
            updatePlayer(null, 0, null, null, 1);
            // socket.emit('server-send-loginSuccess')
            res.json({
                status: 'ok',
                data: loggedPlayer,
                message: "Login Player success"
            })
        } else {
            // socket.emit('server-send-loginFail')
            res.json({
                status: 'false',
                data: {},
                message: "Login Player failed"
            })    
        }                
    } catch(error) {
        res.json({
            status: 'false',
            data: {},
            message: "Login Player failed. error "+error
        })
    }

})

router.post('/update', async(req,res) => {
    

    try {
        let {id, isplaying, name, password, online} = req.body;
        // console.log(isplaying);
        let updatedPlayer = await updatePlayer(id, isplaying, name, password, online);
        if (!updatedPlayer) {
            socket.emit('server-send-updatePlayerFail')
            res.json({
                result: 'false',
                data: {},
                message: "Update player failed"
            })
        }
        else {
            socket.emit('server-send-updatePlayerSuccess')
            res.json({
                
                result: 'ok',
                data: updatedPlayer,
                message: "Update player success"
            })
        }
    }
    catch(error) {
        res.json({
            result: 'false',
            data: {},
            message: "Update player failed. Error" + error
        })
    }
})

router.get('/getAvailablePlayers', async (req,res) => {
    try {
        // const {pageNumber} = req.body;
        let availablePlayers = await getAvailablePlayers();        

        let mapPlayers = {};
        availablePlayers.forEach(player => {
            mapPlayers[player.name] = player;
        })
        // console.log(`mapPlayers = ${JSON.stringify(mapPlayers)}`);
        if(!availablePlayers) {
            res.json({
                result: 'false',
                data: {},
                message: 'get available players failed'
            })
        }
        else {
            res.json({
                result: 'ok',
                data: mapPlayers,
                message: 'get available players success'
            })
        }
    }
    catch(error) {
        res.json({
            result: 'false',
            data: {},
            message: 'get available players failed' + error
        })
    }


})




module.exports = router;
