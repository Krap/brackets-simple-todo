/**
 * @fileOverview Displays and allows to edit current to-do list
 * @author Oleg Koshelnikov
 * @license MIT
 */

/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, $, brackets, window, jQuery, Mustache */

define(function(require)
{
    'use strict';

    var WorkspaceManager    = brackets.getModule('view/WorkspaceManager'),

        Strings             = require('todo/strings'),
        Category            = require('todo/category'),
        TodoItem            = require('todo/todo_item'),

        todoTableHtml       = require('text!html/todo_table.html'),
        todoRowHtml         = require('text!html/todo_table_row.html'),
        todoEditHtml        = require('text!html/todo_edit.html'),
        todoDisplayHtml     = require('text!html/todo_display.html');

    /**
     * Create new TodoEditor
     *
     * @constructor
     * @class TodoEditor
     * @param {Object} todoPanel - Reference to parent to-do panel JQuery element0.
     * @param {Object} callbacks - Callbacks to be called on some user actions
     */
    function TodoEditor(todoPanel, callbacks)
    {
        this._initialize(todoPanel, callbacks);
    }

    /**
     * Get current editor mode
     *
     * @memberOf TodoEditor
     * @returns {Number} - Current editor mode
     */
    TodoEditor.prototype.getMode = function ()
    {
        return this._mode;
    };

    /**
     * This method is called to initiate creation of the new to-do item in the 'uncategorized' category
     *
     * @memberOf TodoEditor
     */
    TodoEditor.prototype.createTodoItem = function ()
    {
        this._createTodoItem(Category.INVALID_ID);
    };

    /**
     * Render given TodoList
     *
     * @memberOf TodoEditor
     * @param {TodoList} todoList - TodoList object to render
     */
    TodoEditor.prototype.render = function (todoList)
    {
        this._setMode(TodoEditor.MODE_IDLE);
        this._render(todoList);
    };

    /****************************** PRIVATE ******************************/

    /**
     * Create new TodoEditor
     *
     * @memberOf TodoEditor
     * @private
     * @param {Object} todoPanel - Reference to parent to-do panel JQuery element0.
     * @param {Object} callbacks - Callbacks to be called on some user actions
     */
    TodoEditor.prototype._initialize = function (todoPanel, callbacks)
    {
        var that = this;

        this._mode = TodoEditor.MODE_IDLE;

        this._callbacks = callbacks;
        this._todoPanel = todoPanel;

        this._tableContainer = this._todoPanel.find('.table-container');

        // Setup callback on to-do item edit start
        this._tableContainer.on('click', '.todo-description', function ()
        {
            that._editTodoItem($(this).data('todo-id'));
        });

        // Setup callback for completion checkboxes
        this._tableContainer.on('change', '.todo-completion input', function ()
        {
            that._callbacks.onCompletionChanged($(this).data('todo-id'), this.checked);
        });
    };

    /**
     * Render given TodoList
     *
     * @memberOf TodoEditor
     * @private
     * @param {TodoList} todoList - TodoList object to render
     */
    TodoEditor.prototype._render = function (todoList)
    {
        var that            = this,
            categories      = todoList.getCategoriesList(),
            categoriesModel = [], category, todo, categoryTodoList, categoryModel, categoryTodoListModel, renderedResult, i, j;

        // Should always have 'uncategorized' category, to be able to easily add to-do item to it
        if (categories.length === 0 || categories[0].getId() !== Category.INVALID_ID)
        {
            categories.unshift(new Category());
        }

        for (i = 0; i < categories.length; ++i)
        {
            category = categories[i];
            categoryTodoList = todoList.getTodoListForCategory(category.getId()) || [];
            categoryTodoListModel = [];
            categoryModel =
            {
                'CATEGORY_NAME':            category.getName(),
                'CATEGORY_ID':              category.getId(),
                'UNCATEGORIZED_CATEGORY':   (category.getId() === Category.INVALID_ID)
            };

            for (j = 0; j < categoryTodoList.length; ++j)
            {
                todo = categoryTodoList[j];

                categoryTodoListModel.push(
                {
                    'TODO_ID':          todo.getId(),
                    'TODO_DESCRIPTION': Mustache.render(todoDisplayHtml, { 'TODO_DESCRIPTION': todo.getDescription() }),
                    'TODO_COMPLETED':   todo.isCompleted()
                });
            }

            categoryModel.RENDERED_TODO_LIST = Mustache.render(todoRowHtml, { 'TODO_LIST': categoryTodoListModel });
            categoriesModel.push(categoryModel);
        }

        renderedResult = Mustache.render(todoTableHtml, { 'CATEGORIES': categoriesModel });

        this._tableContainer.empty().append($(renderedResult));
    };

    /**
     * Set TodoEditor mode
     *
     * @memberOf TodoEditor
     * @private
     * @param {Number} mode - New mode
     */
    TodoEditor.prototype._setMode = function (mode)
    {
        this._mode = mode;
        this._callbacks.onModeChanged(mode);
    };

    /**
     * Get table row DOM element for a given to-do item
     *
     * @memberOf TodoEditor
     * @private
     * @param   {Number} todoId - To-do item identifier
     * @returns {Object} Table row element
     */
    TodoEditor.prototype._getRow = function (todoId)
    {
        return this._tableContainer.find('#ovk-todo-item-' + todoId);
    };

    /**
     * Render single to-do row for a given to-do item in a given mode
     *
     * @memberOf TodoEditor
     * @private
     * @param   {TodoItem} todo - To-do item
     * @param   {Number}   mode - TodoEditor mode
     * @returns {Object}   Rendered row HTML
     */
    TodoEditor.prototype._renderRow = function (todo, mode)
    {
        var rowTemplate = mode !== TodoEditor.MODE_IDLE ? todoEditHtml : todoDisplayHtml, description;

        description = Mustache.render(rowTemplate,
        {
            'TODO_DESCRIPTION':     todo.getDescription(),
            'TODO_DELETE_VISIBLE':  mode === TodoEditor.MODE_EDIT,
            'Strings':              Strings
        });

        return Mustache.render(todoRowHtml,
        {
            'TODO_LIST':
            [{
                'TODO_ID':          todo.getId(),
                'TODO_DESCRIPTION': description,
                'TODO_COMPLETED':   todo.isCompleted()
            }]
        });
    };

    /**
     * Create new to-do item in a given category
     *
     * @memberOf TodoEditor
     * @private
     * @param {Number} categoryId - Category id
     */
    TodoEditor.prototype._createTodoItem = function (categoryId)
    {
        if (this.getMode() === TodoEditor.MODE_IDLE)
        {
            this._startEdit(new TodoItem(), TodoEditor.MODE_ADD, categoryId);
            this._setMode(TodoEditor.MODE_ADD);
        }
    };

    /**
     * Get TodoItem object by id, from currently rendered to-do list
     *
     * @param   {Number}   id -  To-do item id
     * @returns {TodoItem} To-do item object
     */
    TodoEditor.prototype._getTodoItemFromTable = function (id)
    {
        var row         = this._getRow(id),
            isCompleted = row.find('.todo-completion input').is(':checked'),
            description = row.find('.todo-description span').text(),
            todo        = new TodoItem(description, isCompleted);

        todo.setId(id);

        return todo;
    };

    /**
     * Edit existing to-do item
     *
     * @memberOf TodoEditor
     * @private
     * @param {Number} id - Too-do item id
     */
    TodoEditor.prototype._editTodoItem = function (id)
    {
        if (this.getMode() === TodoEditor.MODE_IDLE)
        {
            this._startEdit(this._getTodoItemFromTable(id), TodoEditor.MODE_EDIT);
            this._setMode(TodoEditor.MODE_EDIT);
        }
    };

    /**
     * Switch to to-do item editing mode
     *
     * @memberOf TodoEditor
     * @private
     * @param {TodoItem} todo - To-do item to edit
     * @param {Number}   mode - Editing mode
     * @param {Number}   categoryId - Target category id, used when adding a new to-do item
     */
    TodoEditor.prototype._startEdit = function (todo, mode, categoryId)
    {
        this._editRow(todo, mode, categoryId);
    };

    /**
     * This method is called when user wants to accept changes
     *
     * @memberOf TodoEditor
     * @private
     * @param {TodoItem} todo - Edited/added to-do item
     * @param {Number} categoryId - Target category id, when adding new to-do item
     */
    TodoEditor.prototype._acceptEdit = function (todo, categoryId)
    {
        if (this.getMode() !== TodoEditor.MODE_IDLE)
        {
            var description = $('.ovk-todo-description-edit').find('.description input').val();

            if (this.getMode() === TodoEditor.MODE_ADD)
            {
                this._callbacks.onAdd(categoryId, description);
            }
            else if (this.getMode() === TodoEditor.MODE_EDIT)
            {
                this._callbacks.onEdit(todo.getId(), description, todo.isCompleted());
            }
        }
    };

    /**
     * This method is called when user wants to decline changes
     *
     * @memberOf TodoEditor
     * @private
     * @param {TodoItem} todo - To-do item being edited
     */
    TodoEditor.prototype._declineEdit = function (todo)
    {
        switch (this.getMode())
        {
            case TodoEditor.MODE_ADD:
                this._getRow(todo.getId()).remove();
                break;

            case TodoEditor.MODE_EDIT:
                this._editRow(todo, TodoEditor.MODE_IDLE);
                break;
        }

        this._setMode(TodoEditor.MODE_IDLE);
    };

    /**
     * This method is called when user wants to delete to-do item
     *
     * @memberOf TodoEditor
     * @private
     * @param {TodoItem} todo - To-do item to delete
     */
    TodoEditor.prototype._deleteTodo = function (todo)
    {
        if (this.getMode() === TodoEditor.MODE_EDIT)
        {
            this._callbacks.onDelete(todo.getId());
        }
    };

    /**
     * Edit given to-do item in a given mode
     *
     * @memberOf TodoEditor
     * @private
     * @param {TodoItem} todo       - To-do item to edit
     * @param {Number}   mode       - Editor mode
     * @param {Number}   categoryId - Target category id, when adding new to-do item
     */
    TodoEditor.prototype._editRow = function(todo, mode, categoryId)
    {
        var row     = this._renderRow(todo, mode),
            that    = this;

        // Add or replace existing row
        if (mode === TodoEditor.MODE_ADD)
        {
            // Add row to the given category
            this._tableContainer.find('#ovk-todo-table-category-' + categoryId + ' tbody').append($(row));
        }
        else
        {
            // Replace existing row
            this._getRow(todo.getId()).replaceWith($(row));
        }

        row = this._getRow(todo.getId());

        // Setup callbacks for a new row
        if (mode !== TodoEditor.MODE_IDLE)
        {
            row.keypress(function (event)
            {
                // Accept on enter
                if (event.keyCode === 13)
                {
                    that._acceptEdit(todo, categoryId);
                }
            }).find('.controls .edit-accept').on('click', function ()
            {
                that._acceptEdit(todo, categoryId);
            });

            row.find('.ovk-todo-description-edit').on('click', '.controls .edit-decline', function ()
            {
                that._declineEdit(todo);
            })
            .on('click', '.controls .edit-delete', function ()
            {
                that._deleteTodo(todo);
            })
            .find('.description input').focus();
        }
    };

    /**
     * Defaul editor mode, means - not editing
     *
     * @name TodoEditor#MODE_IDLE
     * @type Number
     * @constant
     */
    TodoEditor.MODE_IDLE  = 0;

    /**
     * Editor mode, means - adding new to-do item
     *
     * @name TodoEditor#MODE_ADD
     * @type Number
     * @constant
     */
    TodoEditor.MODE_ADD   = 1;

    /**
     * Editor mode, means - editing existing to-do item
     *
     * @name TodoEditor#MODE_EDIT
     * @type Number
     * @constant
     */
    TodoEditor.MODE_EDIT  = 2;

    return TodoEditor;
});
