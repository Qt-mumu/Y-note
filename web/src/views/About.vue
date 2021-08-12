<template>
	<div class="about">
		<h1>{{obj.item.arr}}</h1>
		<button @click="addArr">添加数组</button>
	</div>
</template>

<script>
	export default {
		// name:'demo',
		data() {
			return {
				obj: {
					item:{
						arr: [1,2,3]
					}
				}
			}
		},
		methods: {
			addArr() {
				console.log(this)
				this.obj.item.arr.push(this.obj.item.arr[this.obj.item.arr.length-1]+1)
				// this.obj.item.arr.push(arr[arr.length-1]+1)
			}
		},

		watch: {
			
			obj:{
				deep:true,
				handler(newValue, oldValue){
					console.log(newValue, oldValue)
				}
			}
		}
	}
</script>
