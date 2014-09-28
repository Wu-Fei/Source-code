
var _localeStrList = {
};

_localeStrList['cn_zh'] = {
	'Inbox': '邮箱',
	'Test': '测试',
	'Q &amp; A': '答疑',
	'Back': '返回',
	'Submit': '递交',
	'Raise Question': '提问',
	'Sorry, no similar questions were found.': '对不起，没有找到类似问题。',
	'Please enter your question.': '请填写问题内容。',
	'Failed to send your question. Please check your Internet connection and try again.': '问题发送失败，请检查网络连接，稍后再试。'

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

