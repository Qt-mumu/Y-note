<template>
	<div class="login-content">
		<el-card class='login-card' header="登入">
			<el-form :model="model" ref="model">
				<el-form-item label="用户名: ">
					<el-input v-model="model.username"></el-input>
				</el-form-item>
				<el-form-item label="密码: ">
					<el-input type="password" v-model="model.password" show-password></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" native-type="submit" @click="submitForm()">登入</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>


<script>
	export default{
		data() {
			return {
				model: {
					username: '',
					password: '',
				},
			};
		},
		methods: {
			async submitForm(){
				const res = await this.$http.post('login',this.model);
				localStorage.token = res.data['token'];
				if(res.data['isAdminuser']) {
					this.$router.push('/users/list')
				}else{
					this.$router.push('/index')
				}
				
				this.$message({
					type: 'success',
					message:'登录成功', 
				})
			}
		}
	}

	
	
	
	
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// export default {
//   name: 'Home',
//   components: {
//     HelloWorld
//   }
// }
</script>


<style>
	.login-content {
		width: 100%;
		height: 100%;
		margin: 0; 
		padding: 0;
		position: absolute;
		/* display: flex; */
/* 		align-items: center; 
		justify-content: center; */
	}
	.login-card{
		width: 25rem;
		margin: 0 auto;
		position: relative;
		top: 40%;
		transform: translateY(-50%);
	}
</style>



