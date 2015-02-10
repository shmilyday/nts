new Vue({
	el: '#login',

	regs: {
		username: {
			message: '用户名必须是5到20位',
			reg: /^[\w\W\d_-]{5,20}$/
		},
		password: {
			message: '密码必须是5到20位',
			reg: /^[\w\W\d_-]{5,20}$/
		}
	},

	data: {
		message: 'Hi',

		user: {
			username: 'aaa',
			password: 'bbb'
		}
	},

	computed: {
		usernameMessage: function () {
			return this.$options.regs.username.reg.test(this.user.username) ? '': this.$options.regs.username.message;
		},
		passwordMessage: function () {
			return this.$options.regs.password.reg.test(this.user.password) ? '': this.$options.regs.password.message;
		}
	},

	methods: {
		onLogin: function(e) {
			var me = this;

			$.ajax({
				url: '/logistics/login',
				data: me.user,
				type: 'post',
				dataType: 'json',
				success: function(data) {
					if (data.errno === 0) {
						location.href = '/logistics/orderlist'
					} else {
						me.message = data.errmsg || '登录出错，请重新登录！';
					}
				},
				error: function(data) {
					me.message = '登录出错，请重新登录！';
				}
			});

		}
	}
});