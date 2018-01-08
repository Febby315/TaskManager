import $ from 'jquery';

export default async function request(url,options) {
	url="/api"+url;
	options = options || {};
	options.type = options.type || 'GET';
	options.data = options.data || {};
	var ret={};
	console.log(options.data,"---->请求参数");
	await $.ajax({
		type: options.type,
		url:url,
		data:options.data,
		success:function(res){
			console.log(res,"---->响应数据");
			ret.data=res.data;
			ret.total=res.total;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			console.log('error');
		}
	});
	return ret;
}
