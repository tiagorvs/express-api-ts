import * as mongoDb from 'mongodb';
import {Config} from '../config';
import {DebugConsole, ErrorApi} from "../models";

export const DatabaseDataAccess = {

    isConnected: (): Promise<boolean> => {
        new DebugConsole('DatabaseDataAccess/isConnected');
        return new Promise((resolve, reject) => {
            mongoDb.connect(Config.database.path, (err, database) => {
                if (err) reject(false);
                resolve(true);
            });
        });
    },

    insertMany: (collection: string, data: any): Promise<any[]> => {
        new DebugConsole('DatabaseDataAccess/insertMany');
        return new Promise((resolve, reject) => {
            mongoDb.MongoClient.connect(Config.database.path, (err, database) => {
                if (err) {
                    reject(err);
                } else {
                    database.db(Config.database.db).collection(collection).insertMany(data).then(result => {
                        resolve(data);
                        database.close();
                    }, e => {
                        reject(e);
                    });
                }

            });
        });
    },

    insertOne: (collection: string, data: any): Promise<any> => {
        new DebugConsole('DatabaseDataAccess/insertOne');
        return new Promise((resolve, reject) => {
            mongoDb.MongoClient.connect(Config.database.path, (err, database) => {
                if (err) {
                    reject(err);
                } else {
                    database.db(Config.database.db).collection(collection).insertOne(data).then(result => {
                        resolve(result);
                        database.close();
                    }, e => {
                        reject(e);
                    });
                }
            });
        });
    },

    insertOneIfNotExist: (collection: string, filter: any, data: any): Promise<any> => {
        new DebugConsole('DatabaseDataAccess/insertOneIfNotExist');
        return new Promise((resolve, reject) => {
            mongoDb.MongoClient.connect(Config.database.path, (err, database) => {
                if (err) {
                    reject(err);
                } else {
                    database.db(Config.database.db).collection(collection).findOne(filter).then(findResult => {
                        if (!findResult) {
                            database.db(Config.database.db).collection(collection).insertOne(data).then(() => {
                                resolve(data);
                            }, e => {
                                reject(e);
                            });
                        } else {
                            reject(new ErrorApi(500, 'data already exist'));
                        }
                    }, e => {
                        reject(e);
                    });
                }
            });
        });
    },

    find: (collection: string): Promise<any[]> => {
        new DebugConsole('DatabaseDataAccess/find');
        return new Promise((resolve, reject) => {
            mongoDb.MongoClient.connect(Config.database.path, (err, database) => {
                if (err) {
                    reject(err);
                } else {
                    database.db(Config.database.db).collection(collection).find().toArray((error, result) => {
                        if (error) reject(error);
                        resolve(result);
                        database.close();
                    });
                }
            });
        });
    },

    findOne: (collection: string, filter: any): Promise<any> => {
        new DebugConsole('DatabaseDataAccess/findOne');
        return new Promise((resolve, reject) => {
            mongoDb.MongoClient.connect(Config.database.path, (err, database) => {
                if (err) {
                    reject(err);
                } else {
                    database.db(Config.database.db).collection(collection).findOne(filter).then(result => {
                        resolve(result);
                        database.close();
                    }, e => {
                        reject(e);
                    });
                }
            });
        });
    },

    findOneAndUpdate: (collection: string, filter: any, update: any): Promise<any> => {
        new DebugConsole('DatabaseDataAccess/findOneAndUpdate');
        return new Promise((resolve, reject) => {
            mongoDb.MongoClient.connect(Config.database.path, (err, database) => {
                if (err) {
                    reject(err);
                } else {
                    database.db(Config.database.db).collection(collection).findOneAndUpdate(filter, {$set: update}).then(result => {
                        resolve(result);
                        database.close();
                    }, e => {
                        reject(e);
                    });
                }
            });
        });
    },

    findOneAndUpdateOrInsert: (collection: string, filter: any, update: any): Promise<any> => {
        new DebugConsole('DatabaseDataAccess/findOneAndUpdateOrInsert');
        return new Promise((resolve, reject) => {
            mongoDb.MongoClient.connect(Config.database.path, (err, database) => {
                if (err) {
                    reject(err);
                } else {
                    database.db(Config.database.db).collection(collection).findOneAndUpdate(filter, {$set: update}).then(result => {
                        if (result) {
                            resolve(update);
                        } else {
                            database.db(Config.database.db).collection(collection).insertOne(update).then(() => {
                                resolve(update);
                            });
                        }
                        database.close();
                    }, e => {
                        reject(e);
                    });
                }
            });
        });
    },

    findOneAndDelete: (collection: string, filter: any): Promise<any> => {
        new DebugConsole('DatabaseDataAccess/findOneAndDelete');
        return new Promise((resolve, reject) => {
            mongoDb.MongoClient.connect(Config.database.path, (err, database) => {
                if (err) {
                    reject(err);
                } else {
                    database.db(Config.database.db)
                        .collection(collection)
                        .findOneAndDelete(filter)
                        .then((result: any) => {
                            console.log(result)
                            resolve(result);
                            database.close();
                        }, e => {
                            reject(e);
                        });
                }
            });
        });
    }
};

