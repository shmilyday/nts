var vm = avalon.define({
	$id: 'login',

	username: '',
	password: '',
	usernameMessage: '',
	passwordMessage: '',

	isValid: false,

	doLogin: function() {
		var me = this;

		$.ajax({
				url: '/path/to/file',
				type: 'POST',
				data: {
					username: me.username,
					password: me.password
				}
			})
			.done(function() {
				console.log("success");
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				location.href = 'index.html';
			});
	},

	onTextFieldKeyup: function(e, isValid) {
		e.keyCode === 13 && isValid && vm.$model.doLogin();
	}
});

var regs = {
	username: {
		reg: /^[\w\W\d]{5,20}$/,
		message: '用户名必须为5到20位'
	},
	password: {
		reg: /^[\w\W\d]{6,20}$/,
		message: '密码必须为5到20位'
	}
};

function validate(key, value) {
	// 如果验证通过，返回undeinfed，如果验证不通过，返回提示字符串
	var me = this;
	var regConfigure = regs[key];

	if (!regConfigure) return;

	if (regConfigure.reg.test(value)) {
		return;
	} else {
		return regConfigure.message;
	}
}

function watchForm() {
	vm.usernameMessage = validate('username', vm.username);
	vm.passwordMessage = validate('password', vm.password);
	vm.isValid = !validate('username', vm.username) && !validate('password', vm.password);
}

vm.$watch('username', watchForm);

vm.$watch('password', watchForm);