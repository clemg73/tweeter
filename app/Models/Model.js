"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const connection = require('../database.js');
const bdd = require('../config/bddConfig');
const IModel = require('./interfaces/IModel');
const Model = class Model {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = Object.create(this.prototype);
            yield connection.Get();
            return yield connection.db.collection(bdd.collections[obj.constructor.name]).find({}).toArray();
        });
    }
    static getWithFilters(filters, projection) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = Object.create(this.prototype);
            yield connection.Get();
            return yield connection.db.collection(bdd.collections[obj.constructor.name]).find(filters, { projection: projection, }).toArray();
        });
    }
    static insertMany(objsToInsert) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = Object.create(this.prototype);
            yield connection.Get();
            return yield connection.db.collection(bdd.collections[obj.constructor.name]).insertMany(objsToInsert).then((t) => {
                let listIds = [];
                Object.keys(t.insertedIds).forEach((key) => {
                    listIds.push(t.insertedIds[key]);
                });
                return listIds;
            });
        });
    }
    static updateMany(filters, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = Object.create(this.prototype);
            yield connection.Get();
            return yield connection.db.collection(bdd.collections[obj.constructor.name]).updateMany(filters, action).then((t) => { return t.modifiedCount; });
        });
    }
    static deleteMany(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = Object.create(this.prototype);
            yield connection.Get();
            return yield connection.db.collection(bdd.collections[obj.constructor.name]).deleteMany(filters).then((t) => { return t.deletedCount; });
        });
    }
};
module.exports = Model;
