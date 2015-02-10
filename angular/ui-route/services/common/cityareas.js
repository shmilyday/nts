var commonServiceModule = angular.module('myApp.services', []);

commonServiceModule.constant('cityareas', {
	131: {
		id: 131,
		name: '北京',
		aois: {
			111: {
				name: '西二旗',
				id: 111
			},
			222: {
				name: '西三旗',
				id: 222
			},
			333: {
				name: '回龙观',
				id: 333
			}
		}
	},
	132: {
		id: 132,
		name: '哈尔滨',
		aois: {
			111: {
				name: "AAA",
				id: 111
			}
		}
	}
});

commonServiceModule.factory('cityareasService', function(cityareas) {
	function getCitys() {
		var citys = [];

		for (var cityid in cityareas) {
			citys.push(cityareas[cityid]);
		}

		return citys;
	}

	function getAois(city) {
		var obj = cityareas[city.id].aois,
			ret = [];

		for (var ele in obj) {
			ret.push(obj[ele]);
		}

		return ret;
	}

	return {
		getCitys: getCitys,
		getAois: getAois
	};
})