def OT_With_Full_Data(query_prev, query_post, limit = 20):

    agg = [
    {
        "$match":{"$and":query_prev}
    },
    {
        '$addFields': {
            'productoOID': {
                '$toObjectId': '$producto'
            }
        }
    }, {
        '$lookup': {
            'from': 'materiales', 
            'localField': 'productoOID', 
            'foreignField': '_id', 
            'as': 'productoData'
        }
    }, {
        '$unwind': {
            'path': '$productoData'
        }
    }, {
        '$unwind': {
            'path': '$personalAsignado', 
            'preserveNullAndEmptyArrays': True
        }
    }, {
        '$lookup': {
            'from': 'plantilla', 
            'localField': 'personalAsignado', 
            'foreignField': '_id', 
            'as': 'personalAsignado'
        }
    }, {
        '$unwind': {
            'path': '$personalAsignado', 
            'preserveNullAndEmptyArrays': True
        }
    }, {
        '$addFields': {
            'personalAsignado._id': {
                '$toString': '$personalAsignado._id'
            }
        }
    }, {
        '$addFields': {
            'productoNombre': '$productoData.descripcion'
        }
    }, {
        '$group': {
            '_id': '$_id', 
            'producto': {
                '$first': '$producto'
            }, 
            'descripcion': {
                '$first': '$productoNombre'
            }, 
            'cantidad': {
                '$first': '$cantidad'
            }, 
            'inicio': {
                '$first': '$inicio'
            }, 
            'final': {
                '$first': '$final'
            }, 
            'personalAsignado': {
                '$push': '$personalAsignado'
            }, 
            'personalForecast': {
                '$first': '$personalForecast'
            }
        }
    }, {
        '$project': {
            '_id': {"$toString":'$_id'}, 
            'producto': {"$toString":'$producto'}, 
            'descripcion': 1, 
            'cantidad': 1, 
            'inicio': 1, 
            'final': 1, 
            'personalAsignado': 1, 
            'personalForecast': 1, 
            'searchString': {
                '$concat': [
                    '$descripcion', {
                        '$reduce': {
                            'input': '$personalAsignado', 
                            'initialValue': ' ', 
                            'in': {
                                '$concat': [
                                    '$$value', ' ', '$$this.nombre'
                                ]
                            }
                        }
                    }
                ]
            }
        }
    }, {
        "$sort":{"inicio":-1}
    }, {
        "$limit": limit
    }
]
    return agg