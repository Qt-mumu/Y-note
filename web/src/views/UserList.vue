<template>

	<el-table :data="items" stripe style="width: 100%">
		
		<el-table-column prop="_id" label="ID" width="240"></el-table-column>
		<el-table-column prop="username" label="用户名称" width="180"></el-table-column>
		<el-table-column prop="isAdminUser" label="用户权限"></el-table-column>
		<el-table-column fixed="right" label="操作" width="180">
			<template slot-scope="scope">
				<el-button @click="$router.push(`/users/edit/${scope.row._id}`)" type="text" size="medium">编辑</el-button>
				<el-button type="text" @click="remove(scope.row)" size="medium">删除</el-button>
			</template>
		</el-table-column>
	</el-table>

  
</template>

<script>
	export default {
		data() {
			return {
				items:[]
			}
		},
		methods: {
			async fetch(){
				const res = await this.$http.get('rest/users');
				res.data.forEach((items) => {
					if (items['isAdminUser']) {
						items['isAdminUser'] = '管理员用户'
					}else{
						items['isAdminUser'] = '普通用户'
					}
				});
				this.items = res.data
				// console.log(res.data)
			},
			async remove(row) {
				this.$confirm(`是否要删除分类 “${row.name}"`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					await this.$http.delete(`rest/users/${row._id}`)
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					await this.fetch()
				})
				
			}
			
		},
		
		created(){
			// this.$debounce(this.fetch(),300);
			this.fetch()
		},

	}
</script>