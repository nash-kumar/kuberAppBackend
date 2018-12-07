// Populate Query Example
/* {
    path: 'fans',
        match: { age: { $gte: 21 } },
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: 'name -_id',
        options: { limit: 5 }
} */

let recordsPerPage = process.env.LIMIT;

function addRecord(Model, newRecord, callback) {
    Model.create(newRecord, callback);
}
/**
 *
 * @param {Object} options
 * @param {Object} options.sort Sort Options Default = {$natural: -1}
 * @param {Number} options.page Limit the results to page, default page=1
 * @param {Number} options.limit No Of Records Per Page, default=10
 * @param {Boolean} options.all If you want to fetch all records
 * @param {Object} options.populateQuery Populate Query
 * @param {*} callback
 */

function findAll(Model, options = {}, callback) {
    recordsPerPage = parseInt(options.limit || recordsPerPage);
    if (options.all) {
        Model.find()
            .exec(callback);
    } else {
        Model.find({})
            .populate(options.populateQuery || {})
            .sort(options.sort || {
                $natural: -1
            })
            .skip(((options.page || 1) - 1) * recordsPerPage)
            .limit(recordsPerPage)
            .exec(callback)
    }

}

/**
 * @description Call to find documents from Admin Model
 * @param {Object} options
 * @param {Object} options.query Mongoose Query Object
 * @param {Object} options.select Mongoose Query Object
 * @param {string} options._id If query by Id then the id of the document
 * @param {boolean} options.byId If querying by Id set to true otherwise false
 * @param {Object} options.sort Sort Options Default = {$natural: -1}
 * @param {Number} options.page Limit the results to page, default page=1
 * @param {Number} options.limit No Of Records Per Page, default=10
 * @param {Boolean} options.all If you want to fetch all records
 * @param {Object} options.populateQuery Populate Query
 * @param {*} callback
 */
function find(Model, options, callback) {
    recordsPerPage = parseInt(options.limit || recordsPerPage);
    if (options.byId) {
        // options.query._id = id;
        Model.findById(options._id, options.select || {})
            .populate(options.populateQuery || '')
            .exec(callback)
    } else {
        Model.find(options.query || {}, options.select || {})
            .populate(options.populateQuery || '')
            .sort(options.sort || {
                $natural: -1
            })
            .skip(((options.page || 1) - 1) * recordsPerPage)
            .limit(recordsPerPage)
            .exec(callback)
    }
}
/**
 * @description Call to find & update document either by Id or query or both
 * @param {Object} options
 * @param {Object} options.query Mongoose Query Object
 * @param {Object} options.select Mongoose Query Object
 * @param {Object} options.update Mongoose Update Object - Required
 * @param {Object} options.options Mongoose Update Options Object - Required
 * @param {string} options._id If query by Id then the id of the document
 * @param {boolean} options.byId If querying by Id set to true otherwise false
 * @param {*} callback
 */
function update(Model, options, callback) {
    if (options.update) {
        if (options.byId) {
            Model.findByIdAndUpdate(options._id, options.update, options.options, callback);
        } else {
            Model.findOneAndUpdate(options.query, options.update, options.options, callback);
        }
    } else {
        callback(null, null);
    }
}

/**
 * @description Call to find & remove document either by Id or query or both
 * @param {Object} options
 * @param {Object} options.query Mongoose Query Object
 * @param {string} options._id If query by Id then the id of the document
 * @param {boolean} options.byId If querying by Id set to true otherwise false
 * @param {*} callback
 */
function remove(Model, options, callback) {
    if (options.byId) {
        options.query._id = id;
        Model.findByIdAndRemove(options._id, callback)
    } else {
        Model.findOneAndRemove(options.query || {}, callback);
    }
}

module.exports = {
    addRecord: addRecord,
    findAll: findAll,
    find: find,
    update: update,
    remove: remove
}
