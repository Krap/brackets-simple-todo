/**
 * @fileOverview A to-do items provider which stores to-do list in the Trello
 * @author Oleg Koshelnikov
 * @license MIT
 */

/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, $, brackets */

define(function(require)
{
    'use strict';

    var TodoList        = require('todo/todo_list'),
        Category        = require('todo/category'),
        TodoItem        = require('todo/todo_item'),
        Strings         = require('todo/strings');

    function TrelloTodoProvider(settings)
    {

    }

    TrelloTodoProvider.prototype.getTodoList = function ()
    {
        var result = $.Deferred(), todoList = new TodoList(), i, j, category, promises = [];

        $.ajax(
        {
            type: 'GET',
            url: 'https://api.trello.com/1/list/54a4303581b7d254911e2911/cards?key=b6ed85273bd0706844d8b80fba04c436&token=677156c940b40a17fcbd00b88eccbaa19da80cf9f20eacafb63b787339988aa0',
            contentType: 'application/json'
        }).done(function (response)
        {
            for (i = 0; i < response.length; ++i)
            {
                category = todoList.addCategory(response[i].name);

                promises.push($.ajax(
                {
                    type: 'GET',
                    url: 'https://api.trello.com/1/checklists/' + response[i].idChecklists[0] + '/checkItems?key=b6ed85273bd0706844d8b80fba04c436&token=677156c940b40a17fcbd00b88eccbaa19da80cf9f20eacafb63b787339988aa0',
                    contentType: 'application/json'
                }).then(function (response)
                {
                    for (j = 0; j < response.length; ++j)
                    {
                        todoList.addTodo(category.getId(), new TodoItem(response[j].name, response[j].state === 'complete'));
                    }
                }));
            }

            $.when.apply($, promises).done(function () { result.resolve(todoList); } );


        }).fail(function (response)
        {
            console.log(response);
        });

        return result.promise();
    };

    TrelloTodoProvider.prototype.addTodo = function (categoryId, todo)
    {
        return $.Deferred().resolve();
    };

    TrelloTodoProvider.prototype.editTodo = function (id, isCompleted, description)
    {
        return $.Deferred().resolve();
    };

    TrelloTodoProvider.prototype.deleteTodo = function (id)
    {
        return $.Deferred().resolve();
    };

    TrelloTodoProvider.prototype.editCategory = function (id, name)
    {
        return $.Deferred().resolve();
    };

    TrelloTodoProvider.prototype.deleteCategory = function (id)
    {
        return $.Deferred().resolve();
    };

    TrelloTodoProvider.prototype.onProjectChanged = function ()
    {
    };

    TrelloTodoProvider.prototype.applySettings = function (settings)
    {

    };

    TrelloTodoProvider.settings =
    {
        'PROVIDER_NAME':    'Trello',
        'SETTINGS_ID':      'trello-storage',
        'PARAMETERS':
        [
            { 'NAME': 'Token',          'ID': 'token',      'TYPE': 'string', 'DEFAULT': '', 'PLACEHOLDER': Strings.TRELLO_PROVIDER_TOKEN_PLACEHOLDER },
            { 'NAME': 'User',           'ID': 'user',       'TYPE': 'string', 'DEFAULT': '', 'PLACEHOLDER': Strings.TRELLO_PROVIDER_USER_PLACEHOLDER },
            { 'NAME': 'Board',          'ID': 'board',      'TYPE': 'string', 'DEFAULT': '' }
        ],
        'VALIDATE': function (parameters)
        {
        },
        'CUSTOM_TEMPLATE':
        {
            'HTML': require('text!html/trello_settings.html'),
            'SET': function ()
            {
            },
            'GET': function ()
            {

            }
        }
    };

    return TrelloTodoProvider;

});
