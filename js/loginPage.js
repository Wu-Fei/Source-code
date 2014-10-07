var loginPage = function() {
	$('#loginBtnLogin').on('click', function() {
		var page = localStorage.activePage || 'inbox';
		localStorage.activePage = '';
		location.replace('#' + page + 'Page');
		//$.mobile.changePage('#' + page + 'Page', {transition: 'none', changeHash: false});
		return false;
	});
};

