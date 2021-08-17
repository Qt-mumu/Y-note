<template>

		<el-container style="height: 100vh;" class='main'>
			<el-header style="background-color: #F7FBE8;">
<!-- 				<el-row :gutter="20">
					<el-col :span="2" :offset="2"><el-button @click="back()" >取消</el-button></el-col>
					<el-col :span="2" :offset="16"><el-button type="primary" @click="submitNote()">{{ id? '修改': '新建'}}笔记</el-button></el-col>
				</el-row> -->
				<div style="width: 80%; margin: 0 auto;">
					<span><strong>Y-NOTE</strong></span>
					<div class="button_group">	
						<el-button class="button" @click="back()">取消</el-button>
						<el-button class="button" type="primary" @click="submitNote()" right>{{ id? '修改': '新建'}}笔记</el-button>
					</div>

				</div>
				
			</el-header>
			<el-main class="editor" >
				<el-row :gutter="30">
					<el-col :span="21"><el-input placeholder="请输入标题 " v-model="note.title"></el-input></el-col>				
					<el-col :span="3">
						<el-select v-model="note.classification_id" placeholder="请选择分类">
							<el-option
								v-for="item in noteCategories"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
					</el-col>
				</el-row>
				
				
				<mavon-editor class="mavon-editor" v-model='note.noteText' :toolbars= 'toolbars' font-size="18px"  :ishljs = "true" :codeStyle="codeStyle"></mavon-editor>
			</el-main>
		</el-container>
		

</template>
<script>
	// Local Registration
	import { mavonEditor } from 'mavon-editor'
	import 'mavon-editor/dist/css/index.css'
	// import 'mavon-editor/dist/markdown/github-markdown.min.css'
	export default {
		// name: 'editor',
		props: {
			id: {},
		},
		
		// mounted(){
		// 	hljs.highlightCode()
		// },
		
		components: {
			mavonEditor
		},

		data() {
			return {
				noteCategories: [],
				resCategoriesDate: '',
				updateCategoryForm: {
					user_id: '',
					classification:'',
					childrenNote: [],
					sortNumber:'',
				},
				note: {
					user_id: "",
					classification_id: "",
					title: "",
					createTime: "",
					noteText: '',
				},
				preview: 'preview',
				toolbars: {
					bold: true, // 粗体
					italic: true, // 斜体
					header: true, // 标题
					underline: true, // 下划线
					strikethrough: true, // 中划线
					mark: true, // 标记
					superscript: true, // 上角标
					subscript: true, // 下角标
					quote: true, // 引用
					ol: true, // 有序列表
					ul: true, // 无序列表
					link: true, // 链接
					imagelink: true, // 图片链接
					code: true, // code
					table: true, // 表格
					fullscreen: true, // 全屏编辑
					readmodel: true, // 沉浸式阅读
					htmlcode: true, // 展示html源码
					help: true, // 帮助
					/* 1.3.5 */
					undo: true, // 上一步
					redo: true, // 下一步
					trash: true, // 清空
					/* 1.4.2 */
					navigation: true, // 导航目录
					/* 2.1.8 */
					alignleft: true, // 左对齐
					aligncenter: true, // 居中
					alignright: true, // 右对齐
					/* 2.2.1 */
					subfield: true, // 单双栏模式
					preview: true, // 预览		
				},
				codeStyle: 'monokai-sublime',
			}
		},
		methods:{
			async fetch(){
				// console.log(this.id)
				const res = await this.$http.get(`rest/notes/${this.id}`);
				// console.log(res);
				this.note = res.data;
			},
			
			// 获取分类信息
			async classificationFetch(){
				const resCategories = await this.$http.get('rest/categories');
				this.resCategoriesDate = resCategories.data
				let arrCategories = []
				for(let index in resCategories.data){
					// 去除垃圾箱
					if ( index == 1 ){
						continue;
					}
					arrCategories.push({label: resCategories.data[index].classification, value: resCategories.data[index]._id});
				}
				// 结果赋值
				this.noteCategories = arrCategories;

			},
			
			// 提交笔记
			async submitNote() {
				// console.log(this.note);
				if(!this.note.classification_id){
					this.note.classification_id = this.noteCategories[0].value;
				}
				
				// console.log(this.note);
				this.note.createTime = Date()
				// 发生提交请求
				
				
				// 更改分类列表
				if(!this.id){
					// 新建note的情况下 提交note请求和categories请求
					const savedNote = await this.$http.post('rest/notes', this.note);
					for(let index in this.resCategoriesDate) {
						if(this.resCategoriesDate[index]._id === savedNote.data.classification_id){
							this.updateCategoryForm = this.resCategoriesDate[index];
							this.updateCategoryForm.childrenNote.length === 0 ? this.updateCategoryForm.childrenNote.push({note_id: savedNote.data._id, noteTitle: savedNote.data.title, sortNote: 1}): this.updateCategoryForm.childrenNote.push({note_id: savedNote.data._id, noteTitle: savedNote.data.title, sortNote: this.updateCategoryForm.childrenNote.length + 1});				
							console.log(this.updateCategoryForm);
							console.log(`rest/categories/${this.updateCategoryForm._id}`);
							await this.$http.put(`rest/categories/${this.updateCategoryForm._id}`, this.updateCategoryForm);
							continue;
						}
					}
				}else{
					// 修改note的情况下 提交note请求和categories请求
					await this.$http.put(`rest/notes/${this.id}`, this.note);
					for(let index in this.resCategoriesDate) {
						if(this.resCategoriesDate[index]._id === this.note.classification_id){
							this.updateCategoryForm = this.resCategoriesDate[index];
							for(let indexNote in this.updateCategoryForm.childrenNote){
								if(this.updateCategoryForm.childrenNote[indexNote].note_id === this.id){
									this.updateCategoryForm.childrenNote[indexNote].noteTitle = this.note.title;
									await this.$http.put(`rest/categories/${this.updateCategoryForm._id}`, this.updateCategoryForm);
									continue;
								}
							}
							
							
							
						}
					}
				}
				// 清空note
				this.note.user_id = "",
				this.note.classification_id = "",
				this.note.title = "",
				this.note.createTime = "",
				this.note.noteText = '',
				
				// 跳转至index
				this.$router.push('/index');
				this.$message({
					type: 'success',
					message: `${this.id ? '修改': '新建'}成功`
				});
				
			},
			
			back() {
				// this.note.user_id = "",
				// this.note.classification_id = "",
				// this.note.title = "",
				// this.note.createTime = "",
				// this.note.noteText = '',
				// 跳转至index
				this.$router.push('/index');
			}

			
			
		},
		
		
		created() {
			this.classificationFetch()
			this.id && this.fetch();
		},


	}
</script>
<style>
	.editor {
		margin: auto;
		width: 80%;
		height: 100%;
	}
	.editor input {
		background-color: #F7FBE8;
	}
	.button_group{
		float: right;
	}
	.button_group .button{
		background-color: #F6E9BE;
		color: #8c7851;	
		border: 0;
	}
	.button_group .button:hover{
		background-color: #FCF0CA;
	}
	.button_group .button:active{
		background-color: #E3D19B;
		color: #8c7851;	
	}
	.el-row {
		margin-bottom: 20px;
/* 		&:last-child {
		margin-bottom: 0;
		} */
	}
	.mavon-editor{
		height: 100%; 
	}
	.mavon-editor *{
		background-color: #F7FBE8 !important;
		line-height: 220% !important;
		
		font-weight: 600;
	}
	.mavon-editor pre {
		background-color: #EBF0DE !important;
	}
	.mavon-editor code {
		background-color: #EBF0DE !important;
		color: #000 !important;
		font-family: "time of roman" !important;
		color: #42B983 ;
		/* font-size: 1rem !important; */
	}
	.mavon-editor blockquote,.mavon-editor blockquote > p{
		background-color: #EBF0DE !important;
	}

</style>