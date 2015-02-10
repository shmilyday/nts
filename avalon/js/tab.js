var vm = avalon.define({
	$id: 'tab',

	orderlist: true,
	monitor: false,
	auth: false,
	settings: false,

	onLogout: function(e) {
		e.preventDefault();
		location.href = 'login.html';
	},

	onBarClick: function(e, tabname) {
		e.preventDefault();

		vm.orderlist = false;
		vm.monitor = false;
		vm.auth = false;
		vm.settings = false;

		vm[tabname] = true;
	}
});