var DataContext = function DataContext() {
    //var host = 'http://eclasso2o.azurewebsites.net';
    var host = 'http://localhost:56360'
    var dataurl = host + '/breeze/eClassO2OApi';
    
    var manager = new breeze.EntityManager(dataurl);
    var connection = true;
    var user;
    var islocal = false;
    var isconnected = true;
    var datacontext = {
        signin: signin,
        register: register,
        configureBreeze: configureBreeze,
        setAccessToken: setAccessToken,
        getAccessToken: getAccessToken,
        user: user,
        connection: connection,
        create:create,
        save: save,
        getClass: getClass,
        searchQuestion: searchQuestion,
        rollback: rejectChanges
    }
    return datacontext;

    function save(entity) {
        manager.attachEntity(entity, entity.entityAspect.entityState);
        return manager.saveChanges();
    }

    function rejectChanges() {
        manager.rejectChanges();
    }

    function signin(username, password,callback,errcallback) {
        //var rst;
        if (!getAccessToken()) {
            return $.post(host + '/token',
                {
                    grant_type: 'password',
                    username: username,
                    password: password
                }).done(function (result) {
                    if (result.access_token) {
                        setAccessToken(result.access_token);
                        configureBreeze();
                        getCurrentUser(callback);
                    }
                    else {
                        callback(result);
                    }
                }).fail(function (result) { errcallback(result) });

        }
        else {
            configureBreeze();
            getCurrentUser(callback);
        };
    }

    function create(modelname) {
        var result = manager.createEntity(modelname);
        return result;
    }

    function register(username, password, name, email, phone)
    {
        return $.ajax({
            url: host + '/api/account/register',
            type: 'POST',
            dataType: 'json',
            data: {
                'userName': username,
                'password': password,
                'confirmPassword': password,
                'name': name,
                'email': email,
                'phone': phone,
                'role': 'S'
            }
        });
    }

    function configureBreeze() {
        breeze.NamingConvention.camelCase.setAsDefault();
        var ajaxAdapter = breeze.config.getAdapterInstance("ajax");
        ajaxAdapter.defaultSettings = {
            beforeSend: function (xhr, settings) {
                if (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + getAccessToken());
                }
            }
        }
    }
    function setAccessToken(accessToken) {
        sessionStorage.setItem("accessToken", accessToken);
    };

    function getAccessToken() {
        return sessionStorage.getItem("accessToken");
    };

    function getCurrentUser(callback) {
        var query = breeze.EntityQuery.from("currentUser");
        manager.executeQuery(query).then
            (function (result) {
                data.user = result.results[0];
                callback()
            });
    }

    function getClass() {
        var query = breeze.EntityQuery
                    .from("Classes");
        return manager.executeQuery(query);
    }

    function searchQuestion(condition) {
        var query = breeze.EntityQuery
                    .from("Questions")
                    .orderBy("Create")
                    .where("QuestionDetail","contains",condition);
        return manager.executeQuery(query);
    }


};

var data = new DataContext();