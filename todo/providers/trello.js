/**
 * @fileOverview A to-do items provider which stores to-do list in the Trello list
 * @author Oleg Koshelnikov
 * @license MIT
 */

/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, $, brackets, Mustache */

define(function(require)
{
    'use strict';

    var TodoList        = require('todo/todo_list'),
        Category        = require('todo/category'),
        TodoItem        = require('todo/todo_item'),
        Strings         = require('todo/strings'),
        settingsHtml    = require('text!html/trello_settings.html'),
        settings        = {};

    /**
     * Create new TrelloTodoProvider
     *
     * @constructor
     * @class TrelloTodoProvider
     * @param {Object} settings - TrelloTodoProvider's settings: {@link TrelloTodoProvider#settings }
     */
    function TrelloTodoProvider(settings)
    {
        this._applySettings(settings);
    }

    /**
     * Read and return to-do list from Trello
     *
     * @memberOf TrelloTodoProvider
     * @returns {$.Promise} Promise that will be resolved in {@link TodoList} when items load completes, or rejected with an error description
     */
    TrelloTodoProvider.prototype.getTodoList = function ()
    {
        return this._getTodoList();
    };

    /**
     * Add new to-do item to given category
     *
     * @memberOf TrelloTodoProvider
     * @param   {Number}    categoryId - Id of the target category
     * @param   {TodoItem}  todo       - To-do item to add
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype.addTodo = function (categoryId, todo)
    {
        return this._addTodo(categoryId, todo);
    };

    /**
     * Edit existing to-do item
     *
     * @memberOf TrelloTodoProvider
     * @param   {Number}    id          - To-do item identifier
     * @param   {Boolean}   isCompleted - New completion status, or null if not changed
     * @param   {String}    description - New description, or null if not changed
     * @param   {Object}    attributes  - New attributes, or null if not changed
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype.editTodo = function (id, isCompleted, description, attributes)
    {
        return this._editTodo(id, isCompleted, description, attributes);
    };

    /**
     * Delete existing to-do item
     *
     * @memberOf TrelloTodoProvider
     * @param   {Number|Array}    id - To-do item identifier or an Array of identifiers
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype.deleteTodo = function (id)
    {
        return this._deleteTodo(id);
    };

    /**
     * Add new to-do category
     *
     * @memberOf TrelloTodoProvider
     * @param   {String}   name - Category name
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype.addCategory = function (name)
    {
        return this._addCategory(name);
    };

    /**
     * Edit existing category
     *
     * @memberOf TrelloTodoProvider
     * @param   {Number}    id   - Category identifier
     * @param   {String}    name - New category name
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype.editCategory = function (id, name)
    {
        return this._editCategory(id, name);
    };

    /**
     * Delete existing category and all to-do items it contains
     *
     * @memberOf TrelloTodoProvider
     * @param   {Number}    id Category identifier
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype.deleteCategory = function (id)
    {
        return this._deleteCategory(id);
    };

    /**
     * This method is called to notify TrelloTodoProvider that current Brackets project has been changed
     *
     * @memberOf TrelloTodoProvider
     * @returns {Boolean} True if reload is required, false otherwise
     */
    TrelloTodoProvider.prototype.onProjectChanged = function ()
    {
        // No specific actions are required
        return false;
    };

    /**
     * This method is called to notify TrelloTodoProvider that its settings has been changed
     *
     * @memberOf TrelloTodoProvider
     * @param {TrelloTodoProvider#settings} settings - New settings of TrelloTodoProvider
     */
    TrelloTodoProvider.prototype.applySettings = function (settings)
    {
        this._applySettings(settings);
    };

    /****************************** PRIVATE ******************************/

    /**
     * Generic function to call Trello REST API
     *
     * @param   {String}    method          - HTTP method: GET/PUT/POST/DELETE
     * @param   {String}    apiKey          - Trello API Key
     * @param   {String}    token           - Trello authentication user token
     * @param   {String}    url             - Part of REST request URL
     * @param   {Object}    parameters      - Additional parameters to be passed in URL
     * @param   {Object}    body            - Request body
     * @returns {$.Promise} A promise that will be resolved on success or rejected on failure
     */
    function callTrelloApi(method, apiKey, token, url, parameters, body)
    {
        var fullUrl     = TrelloTodoProvider.BASE_URL + url + '?',
            params      = parameters || {},
            requestBody = body || null;

        $.each(params, function (key, value) { fullUrl += key + '=' + value + '&'; });

        fullUrl += 'key=' + apiKey + '&token=' + token;

        return $.ajax({ type: method, url: fullUrl, contentType: 'application/json', 'data': requestBody ? JSON.stringify(requestBody) : null });
    }

    /**
     * Reject given promise with an error details from response
     *
     * @memberOf TrelloTodoProvider
     * @private
     * @param {$.Promise} promise  - Promise to reject
     * @param {Object}    response - Response from Trello
     * @param {String}    message  - Error description
     */
    TrelloTodoProvider.prototype._onApiError = function (promise, response, message)
    {
        promise.reject(message + '. ' + Strings.TRELLO_PROVIDER_API_RESPONSE_ERR + response.status + ' - ' + response.statusText);
    };

    /**
     * Check whether all parameters required to talk to Trello are initialized
     *
     * @memberOf TrelloTodoProvider
     * @private
     * @returns {Boolean} True if initialized, false otherwise
     */
    TrelloTodoProvider.prototype._isApiInitialized = function ()
    {
        return (this._apiKey && this._apiKey.length > 0) &&
               (this._token && this._token.length > 0) &&
               (this._boardId && this._boardId.length > 0) &&
               (this._listId && this._listId.length > 0);
    };

    /**
     * Call Trello REST API
     *
     * @memberOf TrelloTodoProvider
     * @private
     * @param   {String}    method     - HTTP method: GET/PUT/POST/DELETE
     * @param   {String}    url        - Part of REST request URL
     * @param   {Object}    parameters - Additional parameters to be passed in URL
     * @param   {Object}    body       - Request body
     * @returns {$.Promise} A promise that will be resolved on success or rejected on failure
     */
    TrelloTodoProvider.prototype._callTrelloApi = function (method, url, parameters, body)
    {
        return callTrelloApi(method, this._apiKey, this._token, url, parameters, body);
    };

    /**
     * Read and return to-do list from Trello
     *
     * @memberOf TrelloTodoProvider
     * @private
     * @returns {$.Promise} Promise that will be resolved in {@link TodoList} when items load completes, or rejected with an error description
     */
    TrelloTodoProvider.prototype._getTodoList = function ()
    {
        var result      = $.Deferred(),
            todoList    = new TodoList(),
            that        = this;

        this._catergoryIdMap = {};
        this._todoIdMap = {};
        this._cachedTodoList = new TodoList();

        if (this._isApiInitialized())
        {
            // Get all cards from selected list
            this._callTrelloApi('GET', 'list/' + this._listId + '/cards').done(function (response)
            {
                var promises = [];

                if (response && response.length)
                {
                    $.each(response, function (key, value)
                    {
                        var card            = value,
                            category        = todoList.addCategory(card.name),
                            categoryInfo    = {}, todo;

                         categoryInfo.id = card.id;

                        if (card.idChecklists && card.idChecklists.length > 0)
                        {
                            categoryInfo.checklistId = card.idChecklists[0];

                            promises.push(that._callTrelloApi('GET', 'checklists/' + card.idChecklists[0] + '/checkItems').then(function (response)
                            {
                                $.each(response, function (key, value)
                                {
                                    todo = todoList.addTodo(category.getId(), new TodoItem(value.name, value.state === 'complete'));
                                    that._todoIdMap[todo.getId()] = value.id;
                                });
                            }));
                        }

                        that._catergoryIdMap[category.getId()] = categoryInfo;
                    });

                    // Wait for all promises
                    $.when.apply($, promises).done(function ()
                    {
                        that._cachedTodoList = todoList;
                        result.resolve(todoList);
                    }).fail(function (response)
                    {
                        that._onApiError(result, response, Strings.TRELLO_PROVIDER_GET_CHECKITEMS_ERR);
                    });
                }
                else
                {
                    // List is empty
                    result.resolve(todoList);
                }
            }).fail(function (response)
            {
                that._onApiError(result, response, Strings.TRELLO_PROVIDER_GET_CARDS_ERR);
            });
        }
        else
        {
            // Don't throw error if user did not set Trello settings yet
            result.resolve(todoList);
        }

        return result;
    };

    /**
     * Add new to-do item to given category
     *
     * @memberOf TrelloTodoProvider
     * @private
     * @param   {Number}    categoryId - Id of the target category
     * @param   {TodoItem}  todo       - To-do item to add
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype._addTodo = function (categoryId, todo)
    {
        var result          = $.Deferred(),
            categoryInfo    = this._catergoryIdMap[categoryId],
            that            = this, checklist, checkitem;

        if (!$.isEmptyObject(todo.getAttributes()))
        {
            result.reject(Strings.TRELLO_PROVIDER_ATTRS_NOT_SUPP);
            return result;
        }

        if (categoryId !== Category.INVALID_ID)
        {
            if (categoryInfo)
            {
                if (!categoryInfo.checklistId)
                {
                    // Have to create checklist in this card first
                    checklist = { 'idBoard': this._boardId, 'idCard': categoryInfo.id };

                    this._callTrelloApi('POST', 'checklists', {}, checklist).done(function (response)
                    {
                        categoryInfo.checklistId = response.id;

                        // Now call _addTodo again to add to-do item to this checklist
                        that._addTodo(categoryId, todo).done(function () { result.resolve(); }).fail(function (response) { result.reject(response); });
                    }
                    ).fail(function (response)
                    {
                        that._onApiError(result, response, Strings.TRELLO_PROVIDER_NEW_CHECKLIST_ERR);
                    });
                }
                else
                {
                    checkitem = { 'name': todo.getDescription() };

                    // Checklist already present, just add new item to it
                    this._callTrelloApi('POST', 'cards/' + categoryInfo.id + '/checklist/' + categoryInfo.checklistId + '/checkItem', {}, checkitem).done(function ()
                    {
                        result.resolve();
                    }
                    ).fail(function (response)
                    {
                        that._onApiError(result, response, Strings.TRELLO_PROVIDER_ADD_TO_CL_ERR + categoryInfo.checklistId);
                    });
                }
            }
            else
            {
                result.reject(Strings.TRELLO_PROVIDER_ERR_CAT_NOT_FOUND + categoryId);
            }
        }
        else
        {
            result.reject(Strings.TRELLO_PROVIDER_NO_UNCAT_ERR);
        }

        return result;
    };

    /**
     * Edit existing to-do item
     *
     * @memberOf TrelloTodoProvider
     * @private
     * @param   {Number}    id          - To-do item identifier
     * @param   {Boolean}   isCompleted - New completion status, or null if not changed
     * @param   {String}    description - New description, or null if not changed
     * @param   {Object}    attributes  - New attributes, or null if not changed
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype._editTodo = function (id, isCompleted, description, attributes)
    {
        var result          = $.Deferred(),
            category        = this._cachedTodoList.getCategoryContainingTodo(id),
            todo            = this._cachedTodoList.getTodoItem(id),
            trelloTodoId    = this._todoIdMap[id],
            editedTodo      = {},
            that            = this, checklistId, categoryInfo;

        if (attributes && !$.isEmptyObject(attributes))
        {
            result.reject(Strings.TRELLO_PROVIDER_ATTRS_NOT_SUPP);
            return result;
        }

        if (trelloTodoId && category && todo)
        {
            categoryInfo = this._catergoryIdMap[category.getId()];
            checklistId = this._catergoryIdMap[category.getId()].checklistId;

            if (isCompleted !== null)
            {
                editedTodo.state = !!isCompleted ? 'complete' : 'incomplete';
            }

            if (description !== null)
            {
                editedTodo.name = description;
            }

            this._callTrelloApi('PUT', 'cards/' + categoryInfo.id + '/checklist/' + checklistId + '/checkItem/' + trelloTodoId, {}, editedTodo).done(function ()
            {
                result.resolve();
            }).fail(function (response)
            {
                that._onApiError(result, response, Strings.TRELLO_PROVIDER_EDIT_CHECKITEM_ERR + trelloTodoId);
            });
        }
        else
        {
            result.reject(Strings.TRELLO_PROVIDER_ERR_TODO_NOT_FOUND + id);
        }

        return result;
    };

    /**
     * Delete existing to-do item
     *
     * @memberOf TrelloTodoProvider
     * @private
     * @param   {Number|Array}    id - To-do item identifier or an Array of identifiers
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype._deleteTodo = function (idToDelete)
    {
        var result          = $.Deferred(),
            ids             = [].concat(idToDelete),
            promises        = [], i;

        for (i = 0; i <  ids.length; ++i)
        {
            promises.push(this._deleteSingleTodo(ids[i]));
        }

        $.when.apply($, promises).done(function ()
        {
            result.resolve();
        }).fail(function (response)
        {
            result.reject(response);
        });

        return result;
    };

    /**
     * Delete existing to-do item
     *
     * @memberOf TrelloTodoProvider
     * @private
     * @param   {Number} id - To-do item identifier
     * @returns {$.Promise}    Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype._deleteSingleTodo = function (id)
    {
        var result          = $.Deferred(),
            category        = this._cachedTodoList.getCategoryContainingTodo(id),
            trelloTodoId    = this._todoIdMap[id],
            that            = this, checklistId;

        if (trelloTodoId && category)
        {
            checklistId = this._catergoryIdMap[category.getId()].checklistId;

            this._callTrelloApi('DELETE', 'checklists/' + checklistId + '/checkItems/' + trelloTodoId).done(function ()
            {
                result.resolve();
            }).fail(function (response)
            {
                that._onApiError(result, response, Strings.TRELLO_PROVIDER_DEL_CHECKITEM_ERR + trelloTodoId);
            });
        }
        else
        {
            result.reject(Strings.TRELLO_PROVIDER_ERR_TODO_NOT_FOUND + id);
            return false;
        }

        return result;
    };

    /**
     * Add new to-do category
     *
     * @memberOf TrelloTodoProvider
     * @private
     * @param   {String}    name - Category name
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype._addCategory = function (name)
    {
        var result          = $.Deferred(),
            that            = this,
            addedCategory   = { 'name': name, 'idList': this._listId, 'due': null, 'urlSource': null };

        this._callTrelloApi('POST', 'cards', {}, addedCategory).done(function ()
        {
            result.resolve();
        }).fail(function (response)
        {
            that._onApiError(result, response, Strings.TRELLO_PROVIDER_NEW_CARD_ERR);
        });

        return result;
    };

    /**
     * Edit existing category
     *
     * @memberOf TrelloTodoProvider
     * @private
     * @param   {Number}    id   - Category identifier
     * @param   {String}    name - New category name
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype._editCategory = function (id, name)
    {
        var result          = $.Deferred(),
            that            = this,
            categoryInfo    = this._catergoryIdMap[id], editedCategory;

        if (categoryInfo)
        {
            editedCategory = { 'name': name };

            this._callTrelloApi('PUT', 'cards/' + categoryInfo.id, {}, editedCategory).done(function ()
            {
                result.resolve();
            }).fail(function (response)
            {
                that._onApiError(result, response, Strings.TRELLO_PROVIDER_EDIT_CARD_ERR + categoryInfo.id);
            });
        }
        else
        {
            result.reject(Strings.TRELLO_PROVIDER_ERR_CAT_NOT_FOUND + id);
        }

        return result;
    };

    /**
     * Delete existing category and all to-do items it contains
     *
     * @memberOf TrelloTodoProvider
     * @private
     * @param   {Number}    id Category identifier
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    TrelloTodoProvider.prototype._deleteCategory = function (id)
    {
        var result          = $.Deferred(),
            that            = this,
            categoryInfo    = this._catergoryIdMap[id];

        if (categoryInfo)
        {
            this._callTrelloApi('DELETE', 'cards/' + categoryInfo.id).done(function ()
            {
                result.resolve();
            }).fail(function (response)
            {
                that._onApiError(result, response, Strings.TRELLO_PROVIDER_DEL_CARD_ERR + categoryInfo.id);
            });
        }
        else
        {
            result.reject(Strings.TRELLO_PROVIDER_ERR_CAT_NOT_FOUND + id);
        }

        return result;
    };

    /**
     * Apply new settings
     *
     * @memberOf TrelloTodoProvider
     * @private
     * @param {TrelloTodoProvider#settings} settings - New settings of TrelloTodoProvider
     */
    TrelloTodoProvider.prototype._applySettings = function (settings)
    {
        this._apiKey  = settings.key;
        this._token   = settings.token;
        this._boardId = settings.boardId;
        this._listId  = settings.listId;
    };

    /* Custom settings page for Trello provider */

    /**
     * Clear settings error
     *
     * @param {Object} dialogElement - jQuery element of the settings dialog
     */
    function settingsErrorClear(dialogElement)
    {
        dialogElement.find('#ovk-simple-todo-trello-error').empty();
    }

    /**
     * Show settings error message
     *
     * @param {Object} dialogElement - jQuery element of the settings dialog
     * @param {String} message       - Error message
     */
    function settingsErrorShow(dialogElement, message)
    {
        dialogElement.find('#ovk-simple-todo-trello-error').append('<div class="alert" style="margin: 15px" id="ovk-settings-error">' + message + '</div>');
    }

    /**
     * Callback function which is called on API key change
     *
     * @param {Object} dialogElement - jQuery element of the settings dialog
     */
    function onTrelloApiKeyChanged(dialogElement)
    {
        var key         = dialogElement.find('#ovk-simple-todo-trello-key').val().trim(),
            getTokenUrl = '#';

        settingsErrorClear(dialogElement);

        if (key.length > 0)
        {
            // Update 'Get Token' URL
            getTokenUrl = 'https://trello.com/1/authorize?key=' + key + '&name=' + TrelloTodoProvider.APP_NAME + '&expiration=never&response_type=token&scope=read,write';
        }

        dialogElement.find('#ovk-simple-todo-trello-get-token').attr('href', getTokenUrl);
    }

    /**
     * Refresh list of Trello lists
     *
     * @param {Object} dialogElement - jQuery element of the settings dialog
     * @returns {$.Promise} Promise that will be resolved on success, or rejected on failure
     */
    function refreshTrelloLists(dialogElement)
    {
        var key             = dialogElement.find('#ovk-simple-todo-trello-key').val().trim(),
            token           = dialogElement.find('#ovk-simple-todo-trello-token').val().trim(),
            selectedBoardId = dialogElement.find('#ovk-simple-todo-trello-board').val(),
            selectList      = dialogElement.find('#ovk-simple-todo-trello-list'),
            result          = $.Deferred(), i, isSelected;

        settingsErrorClear(dialogElement);
        selectList.empty();
        selectList.prop('disabled', true);

        if (selectedBoardId && selectedBoardId.length > 0 && key.length > 0 && token.length > 0)
        {
            // Read all lists
            callTrelloApi('GET', key, token, 'boards/' + selectedBoardId, { 'lists': 'open' }).done(function (response)
            {
                for (i = 0; i < response.lists.length; ++i)
                {
                    isSelected = (response.lists[i].id === settings.listId) ? 'selected' : '';
                    selectList.append('<option value="' + response.lists[i].id + '" ' + isSelected + '>' + response.lists[i].name + '</option>');
                }

                selectList.prop('disabled', false);
                result.resolve();
            }).fail(function (response)
            {
                settingsErrorShow(dialogElement, Strings.TRELLO_PROVIDER_SETTINGS_GET_LIST_ERR + response.status + ' - ' + response.statusText);
                result.reject();
            });
        }
        else
        {
            result.reject();
        }

        return result;
    }

    /**
     * Refresh list of Trello boards
     *
     * @param {Object} dialogElement - jQuery element of the settings dialog
     */
    function refreshTrelloBoards(dialogElement)
    {
        var key             = dialogElement.find('#ovk-simple-todo-trello-key').val().trim(),
            token           = dialogElement.find('#ovk-simple-todo-trello-token').val().trim(),
            selectBoard     = dialogElement.find('#ovk-simple-todo-trello-board'),
            refreshLink     = dialogElement.find('#ovk-simple-todo-trello-refresh'), i, isSelected;

        if (!refreshLink.hasClass('link-disabled'))
        {
            refreshLink.addClass('link-disabled');
        }
        else
        {
            return;
        }

        settingsErrorClear(dialogElement);
        selectBoard.empty();
        selectBoard.prop('disabled', true);
        refreshTrelloLists(dialogElement);

        if (token.length > 0)
        {
            // Read list of boards
            callTrelloApi('GET', key, token, 'members/my/boards').done(function (response)
            {
                for (i = 0; i < response.length; ++i)
                {
                    isSelected = (response[i].id === settings.boardId) ? 'selected' : '';
                    selectBoard.append('<option value="' + response[i].id + '" ' + isSelected + '>' + response[i].name + '</option>');
                }

                refreshTrelloLists(dialogElement).always(function ()
                {
                    refreshLink.removeClass('link-disabled');
                });

                selectBoard.prop('disabled', false);

            }).fail(function (response)
            {
                settingsErrorShow(dialogElement, Strings.TRELLO_PROVIDER_SETTINGS_GET_BOARD_ERR + response.status + ' - ' + response.statusText);
            });
        }
    }

    /**
     * Definition of settings specific to TrelloTodoProvider
     *
     * @name TrelloTodoProvider#settings
     * @type Object
     * @readonly
     */
    TrelloTodoProvider.settings =
    {
        'PROVIDER_NAME':    'Trello',
        'SETTINGS_ID':      'trello-storage',
        'PARAMETERS':
        [
            { 'NAME': 'API Key',        'ID': 'key',        'TYPE': 'string', 'DEFAULT': '' },
            { 'NAME': 'Token',          'ID': 'token',      'TYPE': 'string', 'DEFAULT': '' },
            { 'NAME': 'Board',          'ID': 'boardId',    'TYPE': 'string', 'DEFAULT': '' },
            { 'NAME': 'List',           'ID': 'listId',     'TYPE': 'string', 'DEFAULT': '' }
        ],
        'VALIDATE': function (parameters) {},
        'CUSTOM_TEMPLATE':
        {
            'RENDER': function ()
            {
                return Mustache.render(settingsHtml,
                {
                    'Strings':       Strings,
                    'GET_KEY_URL':   'https://trello.com/1/appKey/generate'
                });
            },
            'SET': function (dialogElement, parameters)
            {
                var tokenInput = dialogElement.find('#ovk-simple-todo-trello-token');

                settings = parameters;

                dialogElement.find('#ovk-simple-todo-trello-key').val(parameters.key);
                tokenInput.val(parameters.token);

                // Setup callbacks only once
                if (!tokenInput.data('initialized'))
                {
                    dialogElement.find('#ovk-simple-todo-trello-key').change(function () { onTrelloApiKeyChanged(dialogElement); });
                    dialogElement.find('#ovk-simple-todo-trello-token').change(function () { refreshTrelloBoards(dialogElement); });
                    dialogElement.find('#ovk-simple-todo-trello-refresh').click(function () { refreshTrelloBoards(dialogElement); });
                    dialogElement.find('#ovk-simple-todo-trello-board').change(function () { refreshTrelloLists(dialogElement); });

                    tokenInput.data('initialized', true);
                }

                onTrelloApiKeyChanged(dialogElement);
                refreshTrelloBoards(dialogElement);
            },
            'GET': function (dialogElement)
            {
                var parameters  = {};

                parameters.key      = dialogElement.find('#ovk-simple-todo-trello-key').val();
                parameters.token    = dialogElement.find('#ovk-simple-todo-trello-token').val();
                parameters.boardId  = dialogElement.find('#ovk-simple-todo-trello-board').val() || '';
                parameters.listId   = dialogElement.find('#ovk-simple-todo-trello-list').val() || '';

                return parameters;
            }
        }
    };

    /**
     * Application name to be shown on token request
     *
     * @name TrelloTodoProvider#APP_NAME
     * @type String
     * @readonly
     */
    TrelloTodoProvider.APP_NAME = 'Brackets+Simple+To-Do';

    /**
     * Base Trello REST API URL
     *
     * @name TrelloTodoProvider#APP_NAME
     * @type String
     * @private
     * @readonly
     */
    TrelloTodoProvider.BASE_URL = 'https://trello.com/1/';

    return TrelloTodoProvider;
});
