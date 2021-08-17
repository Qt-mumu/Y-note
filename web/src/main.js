import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
// import mavonEditor from 'mavon-editor'  //引入mavon-editor 就是上面所安装的
// import 'mavon-editor/dist/css/index.css'
// Vue.use(mavonEditor)  //让Vue使用mavonEditor
Vue.config.productionTip = false

import http from './http'
Vue.prototype.$http = http

import {_throttle, _debounce} from './util'
Vue.prototype.$throttle = _throttle
Vue.prototype.$debounce = _debounce

// import './plugins/hljs'
// import 'highlight.js/styles/googlecode.css'
// import hljs from 'highlight.js'
// hljs.highlightCode = function () { 
// 	//自定义highlightCode方法，将只执行一次的逻辑去掉
// 	let blocks = document.querySelectorAll('pre code');
// 	[].forEach.call(blocks, hljs.highlightBlock);
// };

import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css' //样式文件
Vue.directive('highlight',function (el) {
	let blocks = el.querySelectorAll('pre code');
	blocks.forEach((block)=>{
		hljs.highlightBlock(block)
  })
})



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import Contextmenu from "vue-contextmenujs"
Vue.use(Contextmenu);


// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'

// // use
// Vue.use(mavonEditor)
