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
        var result = $.Deferred(), todoList = new TodoList();

        todoList.addTodo(Category.INVALID_ID, new TodoItem('Fake todo item', false));
        result.resolve(todoList);

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
        'PROVIDER_NAME':    'TODO - some name',
        'SETTINGS_ID':      'trello-storage',
        'PARAMETERS':
        [
            { 'NAME': 'Something',          'ID': 'someid',      'TYPE': 'string', 'DEFAULT': 'blah' }
        ],
        'VALIDATE': function (parameters)
        {
        }
    };

    return TrelloTodoProvider;

});
