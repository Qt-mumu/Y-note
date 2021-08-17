module.exports = options => {
	//处理数据
	const jwt = require('jsonwebtoken');
	const assert = require('http-assert')
	const user = require('../models/User');
	
	return async (res, req, next) => {
		const token = String(req.req.headers.authorization || '').split(' ').pop();
		assert(token, 401, '请先登入')
		const {id} = jwt.verify(token, req.app.get('secret'))
		assert(id, 401, '请先登入')
		req.userFind = await user.findById(id)
		// console.log(req.userFind)
		assert(req.userFind, 401, '请先登入')
		await next()
	}
}