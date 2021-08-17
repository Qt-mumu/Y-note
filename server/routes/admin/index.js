module.exports = app =>{
	const express = require('express')
	const jwt = require('jsonwebtoken');
	const assert = require('http-assert')
	const User = require('../../models/User');
	const Category = require('../../models/Category');
	const Note = require('../../models/Note');
	const router = express.Router({
		mergeParams: true
	})
	// 登入中间件
	const authMiddleWare = require('../../middleware/auth')
	
	app.post('/admin/api/list/users',authMiddleWare(), async (req, res) => {
		const {username} = req.body;
		const model = await User.find({username})
		res.send(model);
	})
	
	
	// 创建资源
	router.post('/', authMiddleWare(), async (req, res) => {
		// console.log(1);
		// console.log(req.Model.modelName);
		if (req.Model.modelName === 'Category'){
			req.body.user_id = res.userFind._id;
			const findResult = await req.Model.find({'user_id' : res.userFind._id}).sort({'sortNumber':-1});
			if(findResult.length != 0) {
				req.body.sortNumber = findResult[0].sortNumber + 1
			}else {
				req.body.sortNumber = 1
			}
			
			// console.log(req.body);
		}
		if (req.Model.modelName === 'Note') {
			req.body.user_id = res.userFind._id;
			// console.log(req.body)
		}
		const model = await req.Model.create(req.body);
		res.send(model);
	})
	// 修改资源
	router.put('/:id', authMiddleWare(),async (req, res) => {
		if (req.Model.modelName === 'Category'){
			req.body.user_id = res.userFind._id;
		}
		const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
		res.send(model);
	})
	//删除资源
	router.delete('/:id',authMiddleWare(), async (req, res) => {
		await req.Model.findByIdAndDelete(req.params.id, req.body);
		res.send({
			// success: true;
		});
	})
	
	// 资源列表
	router.get('/',authMiddleWare(), async (req, res) => {
		const queryOptions = {};
		if(req.Model.modelName === 'Category') {
			// queryOptions.populate = 'user_id';
			queryOptions.populate =  { path: 'user_id', select: {'username': 1,'_id': 0}};
		}
		// console.log(res.userFind, req.Model)
		let items;
		if(res.userFind['isAdminUser']) {
			items = await req.Model.find().setOptions(queryOptions);
		}else {
			items = await req.Model.find({'user_id' : res.userFind._id}).sort({'sortNumber':1}).setOptions(queryOptions);
		}
		
		// console.log(items)
		res.send(items);
	})
	// 资源详情
	router.get('/:id',authMiddleWare(), async (req, res) => {
		const model = await	req.Model.findById(req.params.id);
		res.send(model);
	})
	
	

	
	app.use('/admin/api/rest/:resource',authMiddleWare(), async (req, res, next) => {
		const modelName = require('inflection').classify(req.params.resource);
		// console.log(`../../models/${modelName}`);
		req.Model = require(`../../models/${modelName}`);
		next();
	}, router)
	

	
	app.post('/admin/api/login', async (req, res) => {
		const {username, password} = req.body;
		// 1. 根据用户找用户
		const user = await User.findOne({username}).select('+password');
		assert(user, 422, '用户名错误')
		// if(!user){
		// 	return res.status(422).send({
		// 		message: '用户名错误',
		// 	})
		// }
		// 2. 校验密码
		const isValid = require('bcrypt').compareSync(password, user.password)
		assert(isValid, 422, '密码错误')
		// if(!isValid){
		// 	res.status(422).send({
		// 		message: '密码错误',
		// 	})	
		// }
		// 3.返回token	
		const token = jwt.sign({
			id: user._id
			// 可以再加别的比如用户名什么的
		}, app.get('secret'));
		// res.send({token});
		res.send({token, isAdminUser:user.isAdminUser});
	})
	
	// 错误处理
	app.use(async (err, req, res, next) => {
		console.log(err);
		res.status(err.statusCode || 500).send({
			message: err.message
		})
	})
	
}