interface IModel {
    getAll<T>(): Promise<T[]>;
    getWithFilters<T>(filters:any,projection:any): Promise<T[]>;
    insertMany<T>(objsToInsert:T[]):Promise<Number[]>;
    updateMany<T>(filters:any,action:any):Promise<Number>;
    deleteMany<T>(filters:any):Promise<Number>;
}
