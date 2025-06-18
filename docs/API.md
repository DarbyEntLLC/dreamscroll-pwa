/**
 * @api {post} /api/dreams Create a new dream
 * @apiName CreateDream
 * @apiGroup Dreams
 * 
 * @apiParam {String} content Dream description
 * @apiParam {String[]} [tags] Optional tags
 * 
 * @apiSuccess {Object} dream Created dream object
 * @apiSuccess {Number} dream.id Unique dream ID
 * @apiSuccess {String} dream.interpretation AI interpretation
 * 
 * @apiError {Object} 400 Invalid input
 * @apiError {Object} 401 Unauthorized
 */