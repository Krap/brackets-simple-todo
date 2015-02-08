/**
 * @fileOverview Main file of Simple To-Do extension
 * @author Oleg Koshelnikov
 * @license MIT
 */

/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, $, brackets */

define(function (require, exports, module)
{
    'use strict';

    var ExtensionUtils      = brackets.getModule('utils/ExtensionUtils'),
        AppInit             = brackets.getModule('utils/AppInit'),
        ProjectManager      = brackets.getModule('project/ProjectManager'),

        FileTodoProvider    = require('todo/providers/file'),
        TrelloTodoProvider  = require('todo/providers/trello'),
        TodoManager         = require('todo/todo_manager'),

        todoManager;

    // Load CSS
    ExtensionUtils.loadStyleSheet(module, 'styles/style.css');

    // Create To-do Manager
    todoManager = new TodoManager();

    // Init
    AppInit.appReady(function()
    {
        todoManager.initialize([ FileTodoProvider, TrelloTodoProvider ]);

        $(ProjectManager).on('projectOpen', function ()
        {
            todoManager.onProjectChanged();
        });
    });
});
