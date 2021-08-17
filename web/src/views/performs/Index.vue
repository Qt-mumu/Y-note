<template>	
	<el-container style="height: 100vh;">
		<el-aside width="226px" class='aside' >
			<div class="aside_top">
				<el-button type="primary" icon="el-icon-plus" class="button" style="margin-right: 0rem;"  @click="addCategory = true"></el-button>
				<!-- <el-button type="primary" icon="el-icon-delete" class="button"></el-button> -->
			</div>
			
			<!-- 添加分类 begin -->
			<el-dialog title="添加分类" :visible.sync="addCategory" width="500px">
				<el-form :model="addCategoryForm">
					<el-form-item label="分类名称: " :label-width="formLabelWidth">
						<el-input v-model="addCategoryForm.classification"></el-input>
					</el-form-item>
				</el-form>
				<el-button @click="closeAddCategoryForm()" style="margin-right: 1.8rem;" >取 消</el-button>
				<el-button type="primary" @click="submitAddCategoryForm()">确 定</el-button>
			</el-dialog>
			<!-- 添加分类 end -->
			
			<div class='aside_nodeList'>
				<div  v-for="(item) in noteCategories"  :key="item._id" class="aside_List_item">
					{{ item.classification }}
				</div>
			</div>
			
			<div class="aside_top">
				<el-button type="primary" icon="el-icon-edit" class="button" style="margin-right: 1.25rem;" @click="addNote()"></el-button>
				<el-button type="primary" icon="el-icon-delete" class="button" @click="drawer = true"></el-button>
				
				<el-drawer
					title="垃圾箱"
					:with-header="false"
					:visible.sync="drawer"
					:direction="direction"
					:show-close="false"
					size="15%">
					<div class="drawer_content">
						<div style="background-color: #DCE7D5;">垃圾箱</div>
						<div  v-for="(item,index) in garbageCan.childrenNote"  :key="index" class="aside_List_item"  @contextmenu.prevent="garbageCan_done(index)" >
							{{ item.noteTitle }}
						</div>
					</div>

				</el-drawer>
				
			</div>
			
			<div class="aside_nodeList">
			
				<draggable :list="nullCategory.childrenNote"  group="a"  @change="log">
					<transition-group name="flip-list" tag="div">
						<div  v-for="(note) in nullCategory.childrenNote"  :key="note.sortNote" class="card_item card_note" @click="$router.push(`/note/edit/${note.note_id}`)">
							{{ note.sortNote }} - {{ note.noteTitle }}
						</div>
					</transition-group>
				</draggable>			
			</div>
		</el-aside>
		
		<!-- header -->
		<el-container>
			<el-header class='header'>
				<span><strong>Y-NOTE</strong></span>
<!-- 				<el-input placeholder="搜索内容" v-model='search'  clearable  style="width: 20rem; background-color: #f7fbe8;"> </el-input>
				<el-button type="primary" icon="el-icon-search" class="button"></el-button>
				<el-button type="primary" icon="el-icon-user" class="button user"></el-button> -->
			</el-header>
			<el-main class='main'>
				<draggable :list="noteCategories" handle=".card_category" @change="log">
					<transition-group name="flip-list" tag="div">
						<div class="box-card" v-for="(c, index1) of noteCategories" v-bind:key="index1" >
						<!-- {{ category.id }} -->
							<div class="card_item card_category">
								{{ c.classification }}
							</div>
							<draggable :list="c.childrenNote"  group="a" @change="log">
								<transition-group name="flip-list" tag="div">
									<div v-for="(note, index) in c.childrenNote" :key="index" class="card_item card_note" @click="$router.push(`/note/edit/${note.note_id}`)" @contextmenu.prevent="rightClick(index,index1)">
										{{ note.sortNote }}-{{ note.noteTitle }}
									</div>
								</transition-group>
							</draggable>

						</div>
					</transition-group>
				</draggable>

			</el-main>
		</el-container>
	</el-container>
</template>


<script>
	import draggable from 'vuedraggable'
	export default {
		
		components: {
			draggable,
		},
		data() {
			return {
				noteCategories: [],  // 用户下的分类
				noteChildLength: [],
				search: '',
				addCategory: false,
				addCategoryForm: {
					user_id: '',
					classification:'',
					childrenNote: [],
					sortNumber:'',
				},
				garbageCan:'',
				nullCategory: '',
				formLabelWidth: '80px',
				drawer: false,
				direction: 'rtl',
				activeNames: '',
				
				
			}
		},
		methods: {
			async fetch(){
				const resCategories = await this.$http.get('rest/categories');
				resCategories.data.forEach((item) => {
					this.noteChildLength.push(item.childrenNote.length)
				})
				console.log(this.noteChildLength)
				this.garbageCan = resCategories.data[1]
				let arrCategories = []
				this.nullCategory = resCategories.data[0]
				for(let index in resCategories.data){
					if (index == 0 || index == 1){
						continue;
					}
					arrCategories.push(resCategories.data[index])
				}
				this.noteCategories = arrCategories
			},
			
			async submitAddCategoryForm() {
				this.addCategory = false;
				await this.$http.post('rest/categories', this.addCategoryForm);
				
				this.fetch()
				this.$message({
					type: 'success',
					message: '添加成功!'
				});
				this.addCategoryForm.classification = '';
			},
			
			closeAddCategoryForm() {
				this.addCategory = false;
				this.addCategoryForm.classification = '';
			},
			addNote() {
				this.$router.push('/note');
			},
			
			rightClick(index,index1) {
				this.$contextmenu({
					items: [
					{
						label: "删除",
						onClick: async () => {
							const arr = this.noteCategories[index1].childrenNote.splice(index,1);
							this.garbageCan.childrenNote.push(arr[0]);
							this.noteCategories[index1].childrenNote.forEach((item,index) => {
								item.sortNote = index + 1;
							})
							// const del = this.noteCategories[index1]
							await this.$http.put(`rest/categories/${this.garbageCan._id}`, this.garbageCan);
							await this.$http.put(`rest/categories/${this.noteCategories[index1]._id}`, this.noteCategories[index1]);
							
							this.$message({
								type: 'success',
								message: "删除成功",
							});

						}
					},
					],
					event,

					customClass: "class-a",
					zIndex: 100,
					minWidth: 150,
					// maxWidth: 230
					});
				return false;
			},
			
			garbageCan_done(index) {
				this.$contextmenu({
					items: [
					{
						label: "彻底删除",
						onClick: async () => {
							const arr1 = this.garbageCan.childrenNote[index];
							this.$confirm(`是否要删除分类 “${arr1.noteTitle}"`, '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(async () => {
								const arr = this.garbageCan.childrenNote.splice(index,1);
								console.log(this.garbageCan.childrenNote.length)
								this.noteChildLength[1] = this.garbageCan.childrenNote.length
								console.log(this.noteChildLength)
								await this.$http.put(`rest/categories/${this.garbageCan._id}`, this.garbageCan);
								await this.$http.delete(`rest/notes/${arr[0].note_id}`)
								this.$message({
									type: 'success',
									message: '彻底删除成功!'
								});
								// await this.fetch()
							})
				
						}
					},
					{
						label: "还原",
						onClick: async () => {
							const arr = this.garbageCan.childrenNote.splice(index,1);
							this.noteChildLength[1] = this.garbageCan.childrenNote.length
							arr[0].sortNote = this.nullCategory.childrenNote.length + 1
							this.nullCategory.childrenNote.push(arr[0]);
							this.noteChildLength[0] = this.garbageCan.childrenNote.length
							// console.log(this.nullCategory)
							await this.$http.put(`rest/categories/${this.garbageCan._id}`, this.garbageCan);
							await this.$http.put(`rest/categories/${this.nullCategory._id}`, this.nullCategory);
							
							this.$message({
								type: 'success',
								message: "已还原到无分类",
							});
									
						}
					}
					],
					event,
				
					customClass: "class-a",
					zIndex: 10000,
					minWidth: 150,
					// maxWidth: 230
					});
				return false;
			},
			checkMove: function(evt){
				console.log(evt)
				// return (evt)
			},
			
			dragStartNullCategories(index){
				console.log("dragStartNullCategories: ",index)
			},
			dropNullCategories(index){
				console.log("dropNullCategories: ",index)
			},
			dragEndNullCategories(index){
				console.log("dragEndNullCategories: ",index)
			},
			dragStartNoteCategories(index){
				console.log("dragStartNoteCategories: ",index)
			},
			dropNoteCategories(index){
				console.log("dropNoteCategories: ",index)
			},
			dragEndNoteCategories(index){
				console.log("dragEndNoteCategories: ",index)
			},

			// dragStart() {
			// 	console.log(1)
			// },
			// dragEnd() {
			// 	console.log(2)
			// },

			async log(evt) {
				console.log(evt);
				if(evt.moved){
					if(evt.moved.element.childrenNote){
						const min = Math.min(evt.moved.newIndex,evt.moved.oldIndex)
						const max = Math.max(evt.moved.newIndex,evt.moved.oldIndex)
						for(let i = min; i <= max; i++){
							this.noteCategories[i].sortNumber = i + 3;
							this.noteChildLength[i+2] = this.noteCategories[i].childrenNote.length;
							await this.$http.put(`rest/categories/${this.noteCategories[i]._id}`, this.noteCategories[i]);
						}
						// console.log(this.noteChildLength)
					}else{
						this.noteCategories.forEach(async (item,index) =>{
							if(item.childrenNote[evt.moved.newIndex].note_id === evt.moved.element.note_id){
								console.log(index)
								item.childrenNote.forEach((item,index) => {
									item.sortNote = index + 1; 
								})
								await this.$http.put(`rest/categories/${this.noteCategories[index]._id}`, this.noteCategories[index]);
							}
							
						})
					}

					
				}

				if(evt.removed){
					const newNullNumber = this.nullCategory.childrenNote.length
					// let noteNewLength = []
					this.noteCategories.forEach(async (item, index) => {
						// noteNewLength.push(item.childrenNote.length)
						if (item.childrenNote.length != this.noteChildLength[index+2]){
							// console.log(index,'change')
							item.childrenNote.forEach((item, index) => {
								item.sortNote = index + 1;
							})
							this.noteChildLength[index+2] = item.childrenNote.length
							await this.$http.put(`rest/categories/${item._id}`, item);
							
							console.log("success")
						}
					})
					
					if(this.noteChildLength[0] != newNullNumber){
						this.nullCategory.childrenNote.forEach((item, index) => {
							item.sortNote = index + 1;
						})
						this.noteChildLength[0] = newNullNumber;
						await this.$http.put(`rest/categories/${this.nullCategory._id}`, this.nullCategory);
						console.log("success")
					}
				}
				
				// for (let i in this.noteCategories){
					
				// }
			},
			// onEnd(evt){
			// 	console.log(evt)
			// }
			
			// handleChange() {
			// 	console.log(this.activeNames);
			// },
			// inputChanged(value) {
			// 	this.activeNames = value;
			// },
			// getComponentData() {
			// 	return {
			// 		on: {
			// 			change: this.handleChange,
			// 			input: this.inputChanged
			// 		},
			// 		attrs:{
			// 			wrap: true
			// 		},
			// 		props: {
			// 			value: this.activeNames
			// 		}
			// 	};
			// }
			
		},
		
		created(){
			this.fetch()
		},
		computed:{
		},
		watch: {
			noteCategories: {
				handler(newValue, oldValue) {
					console.log(newValue,oldValue);
					
					
				},
			}

		}

	}
</script>


<style>
	.aside {
		background-color: #F2F6E4;
		color: #333;
		text-align: center;
		line-height: 3.75rem;
	}
	.aside_top {
		background-color: #ffffee;
	}
	.aside_top .button{
		background-color: #F6E9BE;
		color: #8c7851;	
		border: 0;
	}
	.aside_top .button:hover{
		background-color: #FCF0CA;
	}
	.aside_top .button:active{
		background-color: #E3D19B;
		color: #8c7851;
		
	}
	.drawer_content{
		height: 100%;
		background-color: #F2F6E4;
	}
	.aside_nodeList{
		height: 18.75rem;
		overflow-y: scroll;
	}
	.aside_nodeList::-webkit-scrollbar {
		display: none;
	}
	.aside_List_item{
		padding: 0 1rem;
		white-space:nowrap;
		text-overflow:ellipsis;
		overflow:hidden;
	}
	.aside_List_item:nth-of-type(even){ background-color: #F7FBE8;}
	/* .aside_List_item:nth-of-type(even){ background-color: #F7FBE8;} */
	
	.aside_List_item:hover {
		background-color: #DCE7D5;
	}
	.aside_List_item:active {
		background-color: #B0C0B0;
	}
	
	.header {
		background-color: #F7FBE8;
		color: #333;
		text-align: center;
		height: 3.75rem;
		line-height: 3.75rem;
	}
	.header .user{
		float: right;
		margin-top: 0.625rem;

	}

  
	.main {
		background-color: #EBF0DE;
		color: #716040;
		/* text-align: center; */
		padding: 0;
		margin: 0;
	}
	.box-card {
		margin: 2.9rem;
		background-color: #E6EADA;
		color: #303133;
		transition: .3s;
		border-radius: 4px;
		overflow: hidden;
/* 		box-shadow:
			0 6px 11.4px rgba(0, 0, 0, 0.03),
			0 48px 91px rgba(0, 0, 0, 0.06)
		; */
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
	}
	.card_item{
		float: left;
		/* width: 9.25rem; */
		width: 202px;
		padding: 0 0.75rem;
		height: 3.75rem;
		line-height: 3.75rem;
		text-align: center;
		white-space:nowrap;
		text-overflow:ellipsis;
		overflow:hidden;
		font-family: '微软雅黑';
		cursor: pointer;
	}
	.card_category {
		background-color: #5F9A9D;
		color: #fff;
		font-weight: 800;
		cursor: move;
	}
	.card_category:hover {
		background-color: #457B7D;		
	}
	
	.card_note {
		background-color: #EBF0DE;
		color: #686B5E;
		font-weight: 600;	
	}
	.card_note:nth-of-type(odd){ background-color: #E6EADA;}
	.card_note:hover {
		background-color: #D7DDC3;
	}
	.card_note:active {
		background-color: #B9C29F;
	}
	
	.flip-list-move {
		transition: transform 0.5s;
	}
	.no-move {
		transition: transform 0s;
	}
	.el-drawer rtl{
		background-color: #303133;
	}
 
</style>
