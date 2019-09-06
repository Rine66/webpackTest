import css from './css/index.css';
import less from './css/black.less';
import sass from './css/aa.scss';
//import $ from 'jquery'//配置文件应用另一种方式，全局引入

document.getElementById('title').innerHTML='Hello Webpack';
//document.write('Hello Webpack');

$("#title").html("使用jQuery语法显示---------")


var json = require('../config.json');
document.getElementById("json").innerHTML = json.name+":sex:"+json.sex;

let p = "张三"
document.write(p);