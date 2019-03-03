// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'iview/dist/styles/iview.css';

import Config from '@/config'
import router from '@/router'
import JsonRpc from 'eosjs';
import iView from 'iview';
import ScatterJS from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs'
import Vue from 'vue'

import App from './App'

const rpc = new JsonRpc({httpEndpoint: 'http://127.0.0.1:8888'});

ScatterJS.plugins(new ScatterEOS())
Vue.use(ScatterJS)
Vue.use(iView);
Vue.config.productionTip = false;
Vue.prototype.$config = Config;
Vue.prototype.$eosRpc = rpc;

/* eslint-disable no-new */
new Vue({el: '#app', router, components: {App}, template: '<App/>'})
