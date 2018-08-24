var express = require('express');
var router = express.Router();

import { Player, insertPlayer, findPlayerById, updatePlayer  } from '../models/Player';
import { Game, createNewGame, getAvailableGames, updateGame  } from '../models/Game';
import { Piece, addNewPiece, create32Pieces, updatePiece, pieceAattackPieceB  } from '../models/Piece';

router.post('/createGame', async (req,res) => {   
    try {
        let { player1id, player2id, description } = req.body;
        //Validate
        console.log(player1id);
        console.log(player2id);

        if (player1id < 0 && player2id < 0) {
            res.json({
                status: 'failed',
                data: {},
                message: "Cannot create a new game. At least 1 player ID"
            })
        } 
        else {
            let newGame = await createNewGame(player1id, player2id, description);
            if (newGame) {       
                await updatePlayer(player1id, 1, null, null, null);
                await updatePlayer(player2id, 1, null, null, null);
                res.json({

                    status: 'ok',
                    data: newGame,
                    message: 'Create new game success'
                })
            } 
            else {
    
                res.json({
                    status: 'false',
                    data: {},
                    message: "Cannot create a new game!"
                })    
            }    
        }
    } catch(error) {
        res.json({
            status: 'false',
            data: {},
            message: "Cannot create a game"+error
        })
    }

})

router.post('/startGame', async (req,res) => {   
    try {
        let { id, player1id, player2id, description } = req.body;
        
        if (player1id < 0 || player2id < 0) {
            res.json({
                status: 'failed',
                data: {},
                message: "Cannot start a new game. all players ID must have"
            })
        } 
        else {
            let newGame = await updateGame(id, player1id, player2id, description);
            
            await create32Pieces(player1id, player2id, id);
            
            if (newGame) {
                
                res.json({
                    status: 'ok',
                    data: newGame,
                    message: 'Start game success'
                })
            } 
            else {
    
                res.json({
                    status: 'false',
                    data: {},
                    message: "Cannot start a game!"
                })    
            }    
        }
        
        
                    
    } catch(error) {
        res.json({
            status: 'false',
            data: {},
            message: "Cannot start a game" +error
        })
    }

})



router.get('/getAvailableGames/:pageNumber', async (req,res) => {   
    try {
        const {pageNumber} = req.params;
        //Validate
        let availableGames = await getAvailableGames(pageNumber);                
        if (!availableGames) {
            
            res.json({
                status: 'false',
                data: {},
                message: 'Cannot get available games'
            })
        } else {
            res.json({
                status: 'ok',
                data: availableGames,
                message: "Get available games success!"
            })    
        }                
    } catch(error) {
        res.json({
            status: 'false',
            data: {},
            message: "Get available games success!" +error
        })
    }

})


router.post('/move', async (req,res,next) => {   
    try {
        let { gameid, pieceid, currentpos, dest } = req.body;
        //Validate
        let result = await updatePiece(pieceid, gameid, 0, dest);
        
        
        if (result) {
            
            res.json({
                status: 'ok',
                data: result
            })
        } else {
            res.json({
                status: 'false',
                data: {},
                message: "Cannot move a piece!"
            })    
        }                
    } catch(error) {
        res.json({
            status: 'false',
            data: {},
            message: "Cannot move " +error
        })
    }

})





/*
router.post('/createRoom', async (req,res,next) => {
    let {player1Id} = req.body;
    try {
        res.json({
            status: 'Please wait!!! Finding opponent ...'
        })
        await player2Id to join
    }
    catch(error) {
        res.json({
            status: 'False!!! Cannot find opponent !!!'
        })
        return;
    }
    let player2Id = find()
})

router.post('/joinRoom', async (req,res,next) => {
    let {player2Id} = req.body;
    try {

    }
    catch(error) {
        
    }



})
*/
module.exports = router;
