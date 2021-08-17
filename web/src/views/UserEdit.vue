<template>
	<el-form :model="model" ref="model" placeholder="请输入用户名" label-width="100px" class="demo-ruleForm">
		<h1>{{ id? '编辑': '新建'}}账号</h1>	
		<el-form-item
			label="名称"
			prop="username"
			:rules="[
				{ required: true, message: '不能为空'},
				]"
		>
			<el-input type="name" v-model="model.username" autocomplete="off" style="width: 18rem"></el-input>
		</el-form-item>
		<el-form-item
			label="密码"
			prop="password"
			:rules="[
				{ required: true, message: '不能为空'},
				]"
		>
			<el-input type="password" placeholder="请输入密码" v-model="model.password" autocomplete="off" show-password style="width: 18rem"></el-input>
		</el-form-item>
		
		<el-form-item label="权限">
			<el-select v-model="model.isAdminUser" placeholder="用户权限">
				<el-option label="管理员用户" value=true></el-option>
				<el-option label="普通用户" value=false></el-option>
			</el-select>
		</el-form-item>
		
		<el-form-item>
			<el-button type="primary" @click="submitForm('model')">提交</el-button>
			<!-- <el-button @click="resetForm('model')">重置</el-button> -->
		</el-form-item>
	</el-form>
</template>
<script>
  export default {
	props: {
		id: {},
	},
	
	data() {
		return {
			model: {
				username: '',
				password:'',
				isAdminUser: '',
			},
			init:{
				user_id: '',
				classification:'',
			}
      };
    },
    methods: {
		async submitForm(formName) {
			await this.$refs[formName].validate( async (valid) => {
				if (valid) {
					if(this.id) {
						await this.$http.put(`rest/users/${this.id}`, this.model);
					}else {
						await this.$http.post('rest/users', this.model);
						if(this.model.isAdminUser === 'false'){
							let params = {username: this.model.username}
							console.log(params)
							const res = await this.$http.post('list/users', params);
							console.log(res.data[0]['_id'])
							this.init.user_id = res.data[0]['_id'];
							let arr = ['无类别', '垃圾箱', 'Vue', 'JavaScript', 'yuan']
							arr.forEach(async item => {
								this.init.classification = item;
								await this.$http.post('rest/categories', this.init)
							})

						}
						
						await this.$http.get('rest/users');

					}
					
					this.$router.push('/users/list');

					this.$message({
						message: '保存成功',
						type: 'success'
					});
					// console.log(res);
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		async fetch(){
			const res = await this.$http.get(`rest/users/${this.id}`);
			// console.log(res);
			this.model = res.data;
		},
    },
	
	created (){
		this.id && this.fetch();
	}
  }
</script>