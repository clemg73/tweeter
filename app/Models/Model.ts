const connection = require('../database.js')
const bdd = require('../config/bddConfig')
const IModel = require('./interfaces/IModel')

const Model: IModel = class Model {

    static async getAll<T>(): Promise<T[]>{
        const obj = Object.create(this.prototype)
        await connection.Get();
        return await connection.db.collection(bdd.collections[obj.constructor.name]).find({}).toArray()
    }
    static async getWithFilters<T>(filters:any, projection:any): Promise<T[]>{
        const obj = Object.create(this.prototype)
        await connection.Get();
        return await connection.db.collection(bdd.collections[obj.constructor.name]).find(filters,{projection: projection,}).toArray()
    }
    static async insertMany<T>(objsToInsert:T[]):Promise<Number[]> {
        const obj = Object.create(this.prototype)
        await connection.Get();
        return await connection.db.collection(bdd.collections[obj.constructor.name]).insertMany(objsToInsert).then((t:any) => {
            let listIds:Number[] = [];
            Object.keys(t.insertedIds).forEach((key:any) => {
                listIds.push(t.insertedIds[key])
            });
            return listIds;
        })
    }
    static async updateMany<T>(filters:any,action:any):Promise<Number> {
        const obj = Object.create(this.prototype)
        await connection.Get();
        return await connection.db.collection(bdd.collections[obj.constructor.name]).updateMany(
            filters,
            action
        ).then((t:any) =>{return t.modifiedCount});
    }
    static async deleteMany<T>(filters:any):Promise<Number> {
        const obj = Object.create(this.prototype)
        await connection.Get();
        return await connection.db.collection(bdd.collections[obj.constructor.name]).deleteMany(filters).then((t:any)=>{return t.deletedCount})
    }

  

}

module.exports = Model

