"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const socket_controllers_1 = require("socket-controllers");
const socket_io_1 = require("socket.io");
let rooms = [];
let RoomController = class RoomController {
    joinGame(io, socket, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let room = null;
            if (!message.roomId) {
                room = createRoom(message);
                console.log(`[create room ] - ${room.id} - ${message.playerName}`);
            }
            else {
                room = rooms.find(r => r.id === message.roomId);
                if (room === undefined) {
                    socket.emit("room_join_error", {
                        error: "Room is full please choose another room to play!",
                    });
                }
                message.roomId = room.id;
                room.playerNameOpponent = message.playerName;
            }
            yield socket.join(room.id);
            socket.emit("room_joined", { roomId: room.id });
            if (room.playerName && room.playerNameOpponent) {
                socket.emit("start_game", { start: true, symbol: "x", playerNameOpponent: room.playerName });
                socket.to(room.id).emit('start_game', { start: false, symbol: "o", playerNameOpponent: room.playerNameOpponent });
            }
        });
    }
};
__decorate([
    socket_controllers_1.OnMessage("join_game"),
    __param(0, socket_controllers_1.SocketIO()),
    __param(1, socket_controllers_1.ConnectedSocket()),
    __param(2, socket_controllers_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Server,
        socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "joinGame", null);
RoomController = __decorate([
    socket_controllers_1.SocketController()
], RoomController);
exports.RoomController = RoomController;
const createRoom = (player) => {
    const room = { id: roomId(), playerName: player.playerName };
    rooms.push(room);
    return room;
};
const roomId = () => {
    return Math.random().toString(16).slice(2);
};
