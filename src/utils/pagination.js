const BadRequestError = require('../errors/bad-request')

async function paginationProjectRequest(Model, filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
    try {
        const results = await Model.find(filter).skip((page - 1) * limit).limit(limit)
        const totalCount = await Model.countDocuments(filter);
        if (!results || results.length === 0) {
            throw new BadRequestError('No data found');
        }
        return {
            data: results,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
        };
    }

    catch (error) {
        throw error;
    }
}

module.exports = { paginationProjectRequest };