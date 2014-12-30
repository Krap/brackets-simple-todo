/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, $, brackets, window, jQuery, Mustache */

define(function(require)
{
    'use strict';

    var WorkspaceManager    = brackets.getModule('view/WorkspaceManager'),
        Resizer             = brackets.getModule('utils/Resizer'),

        Strings             = require('todo/strings'),
        TodoItem            = require('todo/todo_item'),

        todoPanelHtml       = require('text!html/panel.html'),
        todoTableHtml       = require('text!html/todo_table.html'),
        todoRowHtml         = require('text!html/todo_table_row.html'),
        todoEditHtml        = require('text!html/todo_edit.html'),
        todoDisplayHtml     = require('text!html/todo_display.html');

    //
    function TodoEditor(todoPanel, callbacks)
    {
        this._mode = TodoEditor.MODE_IDLE;

        this._callbacks = callbacks;
        this._todoPanel = todoPanel;
    }

    TodoEditor.prototype._setMode = function (mode)
    {
        this._mode = mode;
        this._callbacks.onModeChanged(mode);
    };

    TodoEditor.prototype._getRow = function (id)
    {
        return this._todoPanel.find('.table-container #ovk-todo-item-' + id);
    };

    // Get rendered row for a given todo and mode
    TodoEditor.prototype._renderRow = function (todo, mode)
    {
        var description = Mustache.render(mode !== TodoEditor.MODE_IDLE ? todoEditHtml : todoDisplayHtml,
                            { 'description': todo.getDescription(), 'showDelete': mode === TodoEditor.MODE_EDIT, 'Strings': Strings });

        return Mustache.render(todoRowHtml,
        {
            'todos':
            [{
                'id':                   todo.getId(),
                'description':          description,
                'isCompleted':          todo.isCompleted()
            }]
        });
    };

    // Insert row into table for a given to-do item, and given mode
    TodoEditor.prototype._insertRow = function(todo, mode)
    {
        var row     = this._renderRow(todo, mode),
            that    = this;

        // Add row
        if (todo.getId() !== TodoItem.INVALID_ID)
        {
            this._getRow(todo.getId()).replaceWith($(row));
        }
        else
        {
            this._todoPanel.find('.table-container table tbody').prepend($(row));
        }

        row = this._getRow(todo.getId());

        // Setup callbacks
        if (mode !== TodoEditor.MODE_IDLE)
        {
            row.keypress(function (event)
            {
                if (event.keyCode === 13)
                {
                    that._acceptEdit(todo);
                }
            }).find('.controls .edit-accept').on('click', function ()
            {
                that._acceptEdit(todo);
            });

            $('.ovk-todo-description-edit').find('.controls .edit-decline').on('click', function ()
            {
                that._declineEdit(todo);
            });

            $('.ovk-todo-description-edit').find('.controls .edit-delete').on('click', function ()
            {
                that._deleteTodo(todo);
            });

            $('.ovk-todo-description-edit').find('.description input').focus();
        }
        else
        {
            row.find('.todo-description').on('click', function ()
            {
                that._editTodoItem($(this).data('todo-id'));
            });
        }
    };

    TodoEditor.prototype._createTodoItem = function ()
    {
        if (this.getMode() === TodoEditor.MODE_IDLE)
        {
            this._startEdit(new TodoItem(), TodoEditor.MODE_ADD);
            this._setMode(TodoEditor.MODE_ADD);
        }
    };

    TodoEditor.prototype._editTodoItem = function (id)
    {
        if (this.getMode() === TodoEditor.MODE_IDLE)
        {
            var row         = this._getRow(id),
                isCompleted = row.find('.todo-completion input').is(':checked'),
                description = row.find('.todo-description span').text();

            this._startEdit(new TodoItem(id, description, isCompleted), TodoEditor.MODE_EDIT);
            this._setMode(TodoEditor.MODE_EDIT);
        }
    };

    TodoEditor.prototype._startEdit = function (todo, mode)
    {
        this._insertRow(todo, mode);
    };

    TodoEditor.prototype._declineEdit = function (todo)
    {
        switch (this.getMode())
        {
            case TodoEditor.MODE_ADD:
                this._getRow(todo.getId()).remove();
                break;

            case TodoEditor.MODE_EDIT:
                this._insertRow(todo, TodoEditor.MODE_IDLE);
                break;
        }

        this._setMode(TodoEditor.MODE_IDLE);
    };

    TodoEditor.prototype._acceptEdit = function (todo)
    {
        if (this.getMode() !== TodoEditor.MODE_IDLE)
        {
            var description = $('.ovk-todo-description-edit').find('.description input').val();

            if (this.getMode() === TodoEditor.MODE_ADD)
            {
                this._callbacks.onAdd(description);
            }
            else if (this.getMode() === TodoEditor.MODE_EDIT)
            {
                this._callbacks.onEdit(todo.getId(), description, todo.isCompleted());
            }
        }
    };

    TodoEditor.prototype._deleteTodo = function (todo)
    {
        if (this.getMode() === TodoEditor.MODE_EDIT)
        {
            this._callbacks.onDelete(todo.getId());
        }
    };




    //
    TodoEditor.prototype.render = function (todos)
    {
        var renderedDescription, renderedRows, renderedTable, i, that = this, todosModel = [];

        this._setMode(TodoEditor.MODE_IDLE);

        for (i = 0; i < todos.length; ++i)
        {
            renderedDescription = Mustache.render(todoDisplayHtml, { 'description': todos[i].getDescription() });
            todosModel.push(
            {
                'id':           todos[i].getId(),
                'description':  renderedDescription,
                'isCompleted':  todos[i].isCompleted()
            });
        }

        renderedRows  = Mustache.render(todoRowHtml, { 'todos': todosModel });
        renderedTable = Mustache.render(todoTableHtml, { 'content': renderedRows });

        this._todoPanel.find('.table-container').empty().append($(renderedTable)).find('.todo-description').on('click', function ()
        {
            that._editTodoItem($(this).data('todo-id'));
        });
    };

    //
    TodoEditor.prototype.getMode = function ()
    {
        return this._mode;
    };

    TodoEditor.prototype.createTodoItem = function ()
    {
        this._createTodoItem();
    };

    TodoEditor.MODE_IDLE  = 0;
    TodoEditor.MODE_ADD   = 1;
    TodoEditor.MODE_EDIT  = 2;

    return TodoEditor;
});
