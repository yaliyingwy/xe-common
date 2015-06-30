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

		console.log('data: ', data);

		var paramDic = {
			uuid: uuid,     //后台根据这个参数存储每个手机的des密钥
            version: version,   //后台根据这个参数做升级时的老版本兼容
            client_type: client_type, //2 android， 3 ios
            data: data  //明文为json格式
		}

		$.post(url, paramDic, function(response){
			cb(response);
		});
	}

	xe.post = function(url, params, cb) {
		if (key === undefined) {
			console.error('no key set');
			return;
		}

		xe.httpPost(url, params, false, key, new Array(1,2,3,4,5,6,7,8), cb);
	}

	return xe;

})();