<template>

	<el-table :data="items" stripe style="width: 100%">
		
		<el-table-column prop="_id" label="ID" width="240"></el-table-column>
		<el-table-column prop="user_id.username" label="用户名称" width="180"></el-table-column>
		<el-table-column prop="classification" label="用户分类" >
			<template slot-scope="scope">
				<span>{{ scope.row['classification'].toString()}}</span>
			</template>
		</el-table-column>
	
		<el-table-column fixed="right" label="操作" width="180">
			<template slot-scope="scope">
				<el-button type="text" @click="remove(scope.row)" size="medium">删除</el-button>
			</template>
		</el-table-column>
	</el-table>

  
</template>

<script>
	export default {
		// 数据按需加载，数据添加新的property，确保这个新的property是响应式的
		data() {
			return {
				items:[]
			}
		},
		methods: {
			async fetch(){
				const res = await this.$http.get('rest/categories');
				this.items = res.data
				// console.log(res.data)
			},
			async remove(row) {
				this.$confirm(`是否要删除分类 “${row.user_id.username}"`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					await this.$http.delete(`rest/categories/${row._id}`)
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					await this.fetch()
				})
				
			}
			
		},
		
		created(){
			this.fetch()
		},

	}
</script>