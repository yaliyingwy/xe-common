var XE = (function(){
	var xe = {};
	xe.httpPost = function(url, params, encrypt, key, iv, cb) {
		var data;
		if (encrypt) {
			var plainText = JSON.stringify(params);
			data = CryptoJS.AES.encrypt(plainText, key, { iv: iv });
		}
		else
		{
			data = params;
		}

		if (uuid === undefined || version === undefined || client_type === undefined) {
			console.error('uuid: ' + uuid + ', version: ' + version + ', client_type: ' + client_type);
			return;
		}

		console.group();
		console.log('data: %s', JSON.stringify(data));

		var paramDic = {
			uuid: uuid,     //后台根据这个参数存储每个手机的des密钥
            version: version,   //后台根据这个参数做升级时的老版本兼容
            client_type: client_type, //2 android， 3 ios
            data: data  //明文为json格式
		}

		
		console.log('请求 url: %s', url);
		console.log('发送参数: %s', JSON.stringify(paramDic));
		

		$.post(url, paramDic, function(data, status, xhr){
			console.log('返回 data: %s \n status: %o \n xhr: %o \n', JSON.stringify(data), status, xhr);
			console.groupEnd();
			cb(data, status, xhr);

		}, 'json');
	}

	xe.post = function(url, params, cb) {
		xe.httpPost(url, params, false, '12345678', new Array(1,2,3,4,5,6,7,8), cb);
	}

	return xe;

})();