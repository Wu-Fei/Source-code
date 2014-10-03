
var _localeStrList = {
};

_localeStrList['cn_zh'] = {
	'Login': '登录',
	'Inbox': '邮箱',
	'Test': '测试',
	'Q &amp; A': '答疑',
	'Class': '课程',
	'Settings': '设置',
	'Back': '返回',
	'Submit': '递交',
	'Notification': '通知',
	'Message': '私信',
	'Assignment': '作业',
	'Exam': '测试',
	'Raise Question': '提问',
	'Active': '已注册',
	'Pending': '申请中',
	'Apply Class': '申请课程',
	'Quit': '退出',
	'Created By:': '创建者:',
	'Created At:': '创建于:',
	'Members:': '成员数:',
	'QR Code': '',
	'Language': '语言',
	'Sorry, no similar questions were found.': '对不起，没有找到类似问题。',
	'Please enter your question.': '请填写问题内容。',
	'Failed to send your question. Please check your Internet connection and try again.': '问题发送失败，请检查网络连接，稍后再试。',
	'Sorry, you entered an invalid class registration code.': '对不起，您输入了无效的课程注册码。',
	'Sorry, you captured an invalid class registration QR code.': '对不起，您扫描的二维课程注册码无效。',
	'Failed to capture QR code, please try again.': '对不起，扫描二维课程码失败，请再试一次。',
	'The class registration code is invalid.': '输入的课程注册码无效。',
	'You have successfully applied a new class.': '您成功注册了一个新课程。',
	'Sorry, applying class failed.': '对不起，申请课程失败。',
	'Are you sure you want to quit from this class?': '您确定要退出这个课程吗?'

};

_localeStrList['fr_fr'] = {
    'Inbox': 'Inbox',
    'Test': 'Test',
    'Q &amp; A': 'Q &amp; A',
    'Back': 'Retourner',
    'Submit': 'Soumettre',
    'Raise Question': 'Poser une question',
    'Sorry, no similar questions were found.': 'Désole，réponse non-trouvée.',
    'Please enter your question.': 'Replissez votre question',
    'Failed to send your question. Please check your Internet connection and try again.': 'Envoi echoue，merci de verifiez la connexion internet et reessayer。'

};

var _localeLangeCode = '';
var _localeLang = [];

var getLocale = function(s) {
	return _localeLang[s] || s;
}

var localize = function(e, s) {
	e.addClass('lang').data('lang', s).html(_localeLang[s] || s);
}

var localizeAll = function(e) {
	e.find('.lang').each(function() {
		var self = $(this);
		var s = self.html();
		self.data('lang', s).html(_localeLang[s] || s);
	});
}

var getLocaleLanguage = function() {
	return _localeLangeCode;
}

var setLocaleLanguage = function(lang) {
	_localeLang = _localeStrList[_localeLangeCode = lang] || [];

	$('.lang').each(function() {
		var self = $(this);
		var s = self.data('lang');
		self.html(_localeLang[s] || s);
	});
};

