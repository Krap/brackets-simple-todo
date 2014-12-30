/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, $, brackets, window, Mustache */

define(function (require, exports, module)
{
    'use strict';

    var ExtensionUtils      = brackets.getModule('utils/ExtensionUtils'),
        AppInit             = brackets.getModule('utils/AppInit'),
        WorkspaceManager    = brackets.getModule('view/WorkspaceManager'),
        Dialogs             = brackets.getModule('widgets/Dialogs'),
        DefaultDialogs      = brackets.getModule('widgets/DefaultDialogs'),
        ProjectManager      = brackets.getModule('project/ProjectManager'),

        Strings             = require('todo/strings'),

        Settings            = require('todo/settings'),
        SettingsDialog      = require('todo/settings_dialog'),
        TodoItem            = require('todo/todo_item'),
        TodoPanel           = require('todo/panel'),
        FileTodoProvider    = require('todo/providers/file'),

        todoProvider,
        todoPanel;

    // Load CSS
    ExtensionUtils.loadStyleSheet(module, 'styles/style.css');

    //
    Settings.initProviderSettings(FileTodoProvider.settings);

    //
    function setTodoPanelVisible(isVisible)
    {
        if (isVisible)
        {
            $('#ovk-todo-toolbar-icon').addClass('active');
            todoPanel.setVisible(true);
        }
        else
        {
            $('#ovk-todo-toolbar-icon').removeClass('active');
            todoPanel.setVisible(false);
        }
    }

    // Toggle panel visibility
    function toggleTodo()
    {
        setTodoPanelVisible(Settings.toggle(Settings.EXTENSION_ENABLED));
        Settings.save();
    }

    //
    function updateTodoList()
    {
        todoProvider.getTodoList()
        .done(function (todos)
        {
            if (!Settings.get(Settings.COMPLETED_TODO_VISIBLE))
            {
                todos = $.grep(todos, function(item) { return !item.isCompleted(); });
            }

            todoPanel.getEditor().render(todos);
        })
        .fail(function (error)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_LIST_TODO_FAILED, error);
        });
    }

    //
    function onTodoItemAdded(description)
    {
        todoProvider.addTodo(new TodoItem(TodoItem.INVALID_ID, description))
        .done(function ()
        {
            updateTodoList();
        })
        .fail(function (error)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_ADD_TODO_FAILED, error);
        });
    }

    function onTodoItemEdited(id, description, isCompleted)
    {
        todoProvider.editTodo(new TodoItem(id, description, isCompleted))
        .done(function ()
        {
            updateTodoList();
        })
        .fail(function (error)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_EDIT_TODO_FAILED, error);
        });
    }

    function onTodoItemDeleted(id)
    {
        todoProvider.deleteTodo(id)
        .done(function ()
        {
            updateTodoList();
        })
        .fail(function (error)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_DELETE_TODO_FAILED, error);
        });
    }

    //
    function onCompletionChanged(todoId, isCompleted)
    {
        if(isCompleted && Settings.get(Settings.DELETE_COMPLETED_TODO))
        {
            onTodoItemDeleted(todoId);
        }
        else
        {
            todoProvider.editTodo(new TodoItem(todoId, null, isCompleted))
            .fail(function (error)
            {
                Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_EDIT_TODO_FAILED, error);
            })
            .always(function ()
            {
                updateTodoList();
            });
        }
    }

    function onToggleCompleted()
    {
        Settings.toggle(Settings.COMPLETED_TODO_VISIBLE);
        Settings.save();

        updateTodoList();
    }

    function onShowSettings()
    {
        SettingsDialog.show([ FileTodoProvider.settings ])
        .done(function ()
        {
            var promises = [];

            if(Settings.get(Settings.DELETE_COMPLETED_TODO))
            {
                todoProvider.getTodoList()
                .done(function (todos)
                {
                    $.each(todos, function (index, todo)
                    {
                        if (todo.isCompleted())
                        {
                            promises.push(todoProvider.deleteTodo(todo.getId()));
                        }
                    });
                })
                .fail(function (error)
                {
                    Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_LIST_TODO_FAILED, error);
                });
            }

            todoProvider.applySettings(Settings.getProviderSettings(todoProvider.constructor.settings));

            $.when.apply($, promises).always(updateTodoList);
        });
    }

    // Add extension button
    $(document.createElement('a'))
        .attr('id', 'ovk-todo-toolbar-icon')
        .attr('href', '#')
        .attr('title', Strings.EXTENSION_NAME)
        .on('click', toggleTodo)
        .appendTo($('#main-toolbar .buttons'));

    // Init
    AppInit.appReady(function()
    {
        todoProvider = new FileTodoProvider(Settings.getProviderSettings(FileTodoProvider.settings));

        todoPanel = new TodoPanel(
        {
            'onClose':              toggleTodo,
            'onReload':             updateTodoList,
            'onTodoAdd':            onTodoItemAdded,
            'onTodoEdit':           onTodoItemEdited,
            'onTodoDelete':         onTodoItemDeleted,
            'onCompletionChanged':  onCompletionChanged,
            'onToggleCompleted':    onToggleCompleted,
            'onShowSettings':       onShowSettings
        },
        Settings.get(Settings.COMPLETED_TODO_VISIBLE));

        updateTodoList();

        if (Settings.get(Settings.EXTENSION_ENABLED))
        {
            setTodoPanelVisible(true);
        }

        $(ProjectManager).on('projectOpen', function ()
        {
            todoProvider.onProjectChanged();
            updateTodoList();
        });

    });
});
