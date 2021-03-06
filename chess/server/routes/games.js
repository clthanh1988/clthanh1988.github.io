var express = require('express');
var router = express.Router();

import { Player, insertPlayer, findPlayerById, updatePlayer, loginPlayer, getCurrentInfoByPlayer  } from '../models/Player';
import { Game, createNewGame, getAvailableGames, updateGame, getGameFromPlayers, findNamesOfPlayersByRoomname  } from '../models/Game';
import { Piece, addNewPiece, create32Pieces, updatePiece, getPieceByPosition, getPieceByType, getAllPiecesPosition } from '../models/Piece';


router.post('/createGame', async (req,res) => {   
    try {
        let { player1id, player2id } = req.body;
        //Validate
        // console.log(player1id);
        // console.log(player2id);
        // let roomname = player1id + '-' + player2id;

        if (player1id < 0 && player2id < 0) {
            // socket.emit('server-send-createGameFail')
            res.json({
                status: 'failed',
                data: {},
                message: "Cannot create a new game. At least 1 player ID"
            })
        } 
        else {
            let newGame = await createNewGame(player1id, player2id, roomname);
            // console.log('eee')
            if (newGame) {       
                // socket.emit('server-send-createGameSuccess')
                res.json({

                    status: 'ok',
                    data: newGame,
                    message: 'Create new game success'
                })
            } 
            
            else {
                // socket.emit('server-send-createGameFail')
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
        console.log(`ee`);
        let { player1id, player2id } = req.body;
        console.log(player1id);
        console.log(player2id);
        // const roomname = player1id + '-' + player2id;
        // let thisGame = await getGameFromPlayers(player1id, player2id);
        if (!player1id || !player2id) {
            // socket.emit('server-send-startGameFail')
            res.json({
                status: 'failed',
                data: {},
                message: "Cannot start a new game. all players ID must have"
            })
        } 
        else {
            
            let newGame = await createNewGame(player1id, player2id);
            
            await updatePlayer(player1id, 1, null, null, null, newGame.roomname, null);
            
            await updatePlayer(player2id, 1, null, null, null, newGame.roomname, null);
            
            await create32Pieces(player1id, player2id, newGame.roomname);
            
            if (newGame) {
                // socket.emit('server-send-startGameSuccess')
                res.json({
                    status: 'ok',
                    data: newGame,
                    message: 'Start game success'
                })
            } 
            else {
                // socket.emit('server-send-startGameFail')
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

router.post('/findNamesOfPlayersByRoomname', async(req,res) => {
    try {
        let {roomname} = req.body;
        if (!roomname) {
            res.json({
                status: 'failed',
                data: {},
                message: 'Find names failed'
            })
        }
        else {
            let foundNames = await findNamesOfPlayersByRoomname(roomname);
            res.json({
                status: 'ok',
                data: foundNames,
                message: 'Find names success'
            })
        }
    } 
    catch(err) {
        res.json({
            status: 'ok',
            data: {},
            message: 'Find names failed'+ err
        })
    }
})



router.get('/getAvailableGames', async (req,res) => {   
    try {
        // const {pageNumber} = req.params;
        //Validate
        let availableGames = await getAvailableGames();                
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

router.post('/getCurrentInfoByPlayer', async(req,res) => {
    try {
        let {email} = req.body;
        if (!email) {
            res.json({
                status: 'failed',
                data: {},
                message: 'Find info failed'
            })
        }
        else {
            let foundInfo = await getCurrentInfoByPlayer(email);
            res.json({
                status: 'ok',
                data: foundInfo,
                message: 'Find info success'
            })
        }
    } 
    catch(err) {
        res.json({
            status: 'ok',
            data: {},
            message: 'Find info failed'+ err
        })
    }
})


router.post('/move', async (req,res) => {   
    try {
        let { roomname, playerid, piecenumber, dest } = req.body;
        //Validate
        
        let foundPiece = await getPieceByPosition(roomname, dest);
    
        if (foundPiece) {            
            // console.log(`foundPiece.playerid = ${foundPiece.playerid}`);
            // console.log(`playerid = ${playerid}`);
            if (parseInt(foundPiece.playerid) === parseInt(playerid)) {
                // console.log(`eeeeeee= ${foundPiece.playerid}`);
                // socket.emit('server-send-own-move')
                res.json({
                    status: 'failed',
                    message: 'Wrong move. Cannot move to own piece'
                })
                return;
            }
            // console.log(`foundPiece = ${foundPiece}`);
            else if(foundPiece.playerid !== playerid) {
                //await pieceAattackPieceB(roomname, piecenumber, foundPiece.piecenumber, dest);
                // let thisTypeOfPiece = await getPieceByType(roomname, piecenumber);

                // switch (thisTypeOfPiece) {

                // }

                let result1 = await updatePiece(piecenumber, roomname, null, dest);
                let result2 = await updatePiece(foundPiece.piecenumber, roomname, 1, dest);
                let allPiecesPosition = await getAllPiecesPosition(roomname);
                // EMIT
                // console.log(`foundPiece = ${JSON.stringify(foundPiece)}`);
                // io.sockets.emit('server-send-moveSuccess')
                res.json({
                    status: 'ok',
                    message: `Piece ${piecenumber} attacked piece ${foundPiece.piecenumber}`,
                    data: {result1, result2, allPiecesPosition}
                })
                return;
            }
            
        }
        else {
            let result = await updatePiece(piecenumber, roomname, null, dest);
            // io.sockets.emit('server-send-moveSuccess')
                res.json({
                    status: 'ok',
                    message: '',
                    data: result
                })
                return;
        }
    }
    catch(error) {
        res.json({
            status: 'failed',
            data: {},
            message: 'Cannot move a piece' + error
        })
        return;
    }   
})

module.exports = router;
