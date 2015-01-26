/**
 * @fileOverview Displays and allows to edit current to-do list
 * @author Oleg Koshelnikov
 * @license MIT
 */

/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, $, brackets, Mustache */

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
        todoDisplayHtml     = require('text!html/todo_display.html'),
        todoCatDisplayHtml  = require('text!html/todo_cat_display.html'),
        todoCatEditHtml     = require('text!html/todo_cat_edit.html'),
        stripeSaverHtml     = require('text!html/table_stripe_saver.html');

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
     * Get currently applied filter object
     *
     * @memberOf TodoEditor
     * @returns {Object} Editor filter object: { 'completed': true|false|null }
     */
    TodoEditor.prototype.getFilter = function ()
    {
        return this._filter;
    };

    /**
     * Apply new filter
     *
     * @memberOf TodoEditor
     * @param {Object} filter Editor filter object
     */
    TodoEditor.prototype.setFilter = function (filter)
    {
        this._setFilter(filter);
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
     * This method is called to initiate creation of a new category
     *
     * @memberOf TodoEditor
     */
    TodoEditor.prototype.createCategory = function ()
    {
        this._createCategory();
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
        this._filter = { 'completed': null };
        this._cachedCategories = {};

        this._callbacks = callbacks;
        this._todoPanel = todoPanel;

        this._tableContainer = this._todoPanel.find('.table-container');

        // Setup callback on to-do item edit start
        this._tableContainer.on('click', '.todo-description', function ()
        {
            that._editTodoItem($(this).data('todo-id'));
        });

        // Setup callback on to-do item add to specific category
        this._tableContainer.on('click', '.ovk-todo-add-to-cat', function ()
        {
            that._createTodoItem($(this).data('category-id'));
        });

        // Setup callback on to-do category edit
        this._tableContainer.on('click', '.todo-category .category-name', function ()
        {
            that._editCategory($(this).data('category-id'));
        });

        // Setup callback on to-do category hide/show
        this._tableContainer.on('click', '.ovk-todo-fold-cat', function ()
        {
            that._toggleCategoryVisibility($(this).data('category-id'));
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
            categoriesModel = [],
            categoriesCache = {}, category, todo, categoryTodoList, categoryModel, categoryTodoListModel, renderedResult, numberOfCompleted, i, j;

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
            numberOfCompleted = 0;
            categoryModel =
            {
                'CATEGORY_ID':              category.getId(),
                'UNCATEGORIZED_CATEGORY':   category.getId() === Category.INVALID_ID
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

                numberOfCompleted += todo.isCompleted() ? 1 : 0;
            }

            categoryModel.CATEGORY_HEADER = Mustache.render(todoCatDisplayHtml,
            {
                'CATEGORY_ID':      category.getId(),
                'CATEGORY_NAME':    category.getName(),
                'TOTAL_ITEMS':      categoryTodoList.length,
                'COMPLETED_ITEMS':  numberOfCompleted,
                'Strings':          Strings
            });

            categoriesCache[category.getId()] =
            {
                'totalTodoItems':       categoryTodoList.length,
                'completedTodoItems':   numberOfCompleted,
                'visible':              this._cachedCategories[category.getId()] ? this._cachedCategories[category.getId()].visible : true
            };

            categoryModel.RENDERED_TODO_LIST = Mustache.render(todoRowHtml, { 'TODO_LIST': categoryTodoListModel });
            categoriesModel.push(categoryModel);
        }

        renderedResult = Mustache.render(todoTableHtml, { 'CATEGORIES': categoriesModel, 'Strings': Strings });

        this._tableContainer.empty().append($(renderedResult));

        this._applyFilterIfRequired();

        // Update cached categories data
        this._cachedCategories = categoriesCache;

        $.each(this._cachedCategories, function (key, value)
        {
            if (!value.visible)
            {
                that._setCategoryVisible(key, false);
            }
        });
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
     * Get table header row DOM element for a given category
     *
     * @param   {Number} categoryId - Category identifier
     * @returns {Object} Table header row element
     */
    TodoEditor.prototype._getCategoryRow = function (categoryId)
    {
        return this._tableContainer.find('#ovk-todo-table-category-' + categoryId + ' thead tr');
    };

    /**
     * Get table DOM element for a given category
     *
     * @param   {Number} categoryId - Category identifier
     * @returns {Object} Table element
     */
    TodoEditor.prototype._getCategoryTable = function (categoryId)
    {
        return this._tableContainer.find('#ovk-todo-table-category-' + categoryId);
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
            if (categoryId !== Category.INVALID_ID && !this._cachedCategories[categoryId].visible)
            {
                this._toggleCategoryVisibility(categoryId);
            }

            this._startEdit(new TodoItem(), TodoEditor.MODE_ADD, categoryId);
            this._setMode(TodoEditor.MODE_ADD);
        }
    };

    /**
     * Create new category
     *
     * @memberOf TodoEditor
     * @private
     */
    TodoEditor.prototype._createCategory = function ()
    {
        if (this.getMode() === TodoEditor.MODE_IDLE)
        {
            this._editCategoryRow(new Category(TodoEditor.NEW_CATEGORY_ID), TodoEditor.MODE_CAT_ADD);
            this._setMode(TodoEditor.MODE_CAT_ADD);
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
     * Get Category object by id, from currently rendered to-do list
     *
     * @param   {Number}   categoryId -  Category id
     * @returns {Category} Category object
     */
    TodoEditor.prototype._getCategoryFromTable = function (categoryId)
    {
        var name        = this._getCategoryRow(categoryId).find('.category-name').text(),
            category    = new Category(categoryId, name);

        return category;
    };

    /**
     * Edit existing to-do item
     *
     * @memberOf TodoEditor
     * @private
     * @param {Number} id - To-do item id
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
     * Edit existing to-do category
     *
     * @memberOf TodoEditor
     * @private
     * @param {Number} categoryId - Category id
     */
    TodoEditor.prototype._editCategory = function (categoryId)
    {
        if (this.getMode() === TodoEditor.MODE_IDLE)
        {
            this._editCategoryRow(this._getCategoryFromTable(categoryId), TodoEditor.MODE_CAT_EDIT);
            this._setMode(TodoEditor.MODE_CAT_EDIT);
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
     * @param {TodoItem|Category} todo - Edited/added to-do item or to-do category
     * @param {Number} categoryId - Target category id, when adding new to-do item
     */
    TodoEditor.prototype._acceptEdit = function (todo, categoryId)
    {
        var description, categoryName;

        if (this.getMode() === TodoEditor.MODE_ADD || this.getMode() === TodoEditor.MODE_EDIT)
        {
            description = $('.ovk-todo-description-edit').find('.description input').val();

            if (this.getMode() === TodoEditor.MODE_ADD)
            {
                this._callbacks.onAdd(categoryId, description);
            }
            else if (this.getMode() === TodoEditor.MODE_EDIT)
            {
                this._callbacks.onEdit(todo.getId(), description, todo.isCompleted());
            }
        }
        else if(this.getMode() === TodoEditor.MODE_CAT_ADD || this.getMode() === TodoEditor.MODE_CAT_EDIT)
        {
            categoryName = $('.ovk-todo-category-edit').find('input').val();

            if (this.getMode() === TodoEditor.MODE_CAT_ADD)
            {
                this._callbacks.onCategoryAdd(categoryName);
            }
            else if (this.getMode() === TodoEditor.MODE_CAT_EDIT)
            {
                this._callbacks.onCategoryEdit(todo.getId(), categoryName);
            }
        }
    };

    /**
     * This method is called when user wants to decline changes
     *
     * @memberOf TodoEditor
     * @private
     * @param {TodoItem|Category} todo - To-do item or to-do category being edited (depends on current mode)
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

            case TodoEditor.MODE_CAT_ADD:
                this._getCategoryTable(todo.getId()).remove();
                break;

            case TodoEditor.MODE_CAT_EDIT:
                this._editCategoryRow(todo, TodoEditor.MODE_IDLE);
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
     * This method is called when user wants to delete category
     *
     * @memberOf TodoEditor
     * @private
     * @param {Category} category - Category object to delete
     */
    TodoEditor.prototype._deleteCategory = function (category)
    {
        if (this.getMode() === TodoEditor.MODE_CAT_EDIT)
        {
            this._callbacks.onCategoryDelete(category);
        }
    };

    /**
     * Set and apply new filter
     *
     * @memberOf TodoEditor
     * @private
     * @param {Object} filter Editor filter object
     */
    TodoEditor.prototype._setFilter = function (filter)
    {
        if (this.getMode() === TodoEditor.MODE_IDLE)
        {
            this._filter = filter;
            this._applyFilter();
        }
    };

    /**
     * This method applies current filter only if it is different from dfault one
     *
     * @memberOf TodoEditor
     * @private
     */
    TodoEditor.prototype._applyFilterIfRequired = function ()
    {
        if (this._filter.completed !== TodoEditor.DEFAULT_FILTER.completed)
        {
            this._applyFilter();
        }
    };

    /**
     * Apply current filter and hide items that do not match it
     *
     * @memberOf TodoEditor
     * @private
     */
    TodoEditor.prototype._applyFilter = function ()
    {
        var that = this;

        // Clear any existing stripe saver
        this._tableContainer.find('tr.ovk-table-stripe-saver').remove();

        // Hide each row that does not match the filter
        this._tableContainer.find('tr').each(function ()
        {
            var row         = $(this),
                isChecked   = !!row.find('.todo-completion input').is(':checked'),
                filtered    = (that._filter.completed !== null && that._filter.completed !== isChecked);

            if (filtered)
            {
                row.before(stripeSaverHtml);
                row.hide();
            }
            else
            {
                row.show();
            }
        });
    };

    /**
     * Edit given to-do item in a given mode
     *
     * @memberOf TodoEditor
     * @private
     * @param {TodoItem} todo       - To-do item to edit/display
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
            }).on('click', '.edit-accept', function ()
            {
                that._acceptEdit(todo, categoryId);
            }).on('click', '.edit-decline', function ()
            {
                that._declineEdit(todo);
            })
            .on('click', '.edit-delete', function ()
            {
                that._deleteTodo(todo);
            })
            .find('.description input').focus();
        }
    };

    /**
     * Set visibility (folding) for a given category
     *
     * @memberOf TodoEditor
     * @private
     * @param {Number}  categoryId - Id of the category
     * @param {Boolean} isVisible  - Visibility
     */
    TodoEditor.prototype._setCategoryVisible = function (categoryId, isVisible)
    {
        this._getCategoryTable(categoryId).find('tbody').toggle(isVisible);
        this._getCategoryTable(categoryId).find('.ovk-todo-fold-cat').toggleClass('folded', !isVisible);
    };

    /**
     * Toggle category visibility
     *
     * @memberOf TodoEditor
     * @private
     * @param {Number} categoryId - Id of the category
     */
    TodoEditor.prototype._toggleCategoryVisibility = function (categoryId)
    {
        if (this.getMode() === TodoEditor.MODE_IDLE)
        {
            this._cachedCategories[categoryId].visible = !this._cachedCategories[categoryId].visible;
            this._setCategoryVisible(categoryId, this._cachedCategories[categoryId].visible);
        }
    };

    /**
     * Render category HTML table row for a given category
     *
     * @memberOf TodoEditor
     * @private
     * @param   {Category} category - Category object
     * @param   {Number}   mode     - Edit mode
     * @returns {String}   Rendered HTML
     */
    TodoEditor.prototype._renderCategoryRow = function (category, mode)
    {
        var that = this;

        if (mode === TodoEditor.MODE_IDLE)
        {
            return Mustache.render(todoCatDisplayHtml,
            {
                'CATEGORY_ID':      category.getId(),
                'CATEGORY_NAME':    category.getName(),
                'COMPLETED_ITEMS':  that._cachedCategories[category.getId()].completedTodoItems,
                'TOTAL_ITEMS':      that._cachedCategories[category.getId()].totalTodoItems,
                'Strings': Strings
            });
        }
        else
        {
            return Mustache.render(todoCatEditHtml,
            {
                'CATEGORY_NAME':            category.getName(),
                'CATEGORY_DELETE_VISIBLE':  mode === TodoEditor.MODE_CAT_EDIT,
                'Strings': Strings
            });
        }
    };

    /**
     * Render HTML table for a new category
     *
     * @memberOf TodoEditor
     * @private
     * @param   {Category} category - Category object
     * @returns {String}   Rendered HTML
     */
    TodoEditor.prototype._renderNewCategory = function (category)
    {
        return Mustache.render(todoTableHtml,
        {
            'CATEGORIES':
            [{
                'CATEGORY_ID':     category.getId(),
                'CATEGORY_HEADER': this._renderCategoryRow(category, TodoEditor.MODE_CAT_ADD)
            }],
            'Strings': Strings
        });
    };

    /**
     * Edit given category HTML row
     *
     * @memberOf TodoEditor
     * @private
     * @param {Category} category - Category object to edit/display
     * @param {Number}   mode     - Editing mode
     */
    TodoEditor.prototype._editCategoryRow = function (category, mode)
    {
        var that = this, row;

        // Add new table or replace existing table's header
        if (mode === TodoEditor.MODE_CAT_ADD)
        {
            // Add an empty table
            this._tableContainer.append(this._renderNewCategory(category));
        }
        else
        {
            this._getCategoryRow(category.getId()).replaceWith($(this._renderCategoryRow(category, mode)));
        }

        row = this._getCategoryRow(category.getId());

        // Setup callbacks for a new row
        if (mode !== TodoEditor.MODE_IDLE)
        {
            row.keypress(function (event)
            {
                // Accept on enter
                if (event.keyCode === 13)
                {
                    that._acceptEdit(category);
                }
            }).on('click', '.edit-accept', function ()
            {
                that._acceptEdit(category);
            }).on('click', '.edit-decline', function ()
            {
                that._declineEdit(category);
            })
            .on('click', '.edit-delete', function ()
            {
                that._deleteCategory(category);
            })
            .find('input').focus();
        }
        else
        {
            if (this._cachedCategories[category.getId()].visible === false)
            {
                this._setCategoryVisible(category.getId(), false);
            }
        }
    };

    /**
     * Defaul editor mode, means - not editing
     *
     * @name TodoEditor#MODE_IDLE
     * @type Number
     * @constant
     */
    TodoEditor.MODE_IDLE = 0;

    /**
     * Editor mode, means - adding new to-do item
     *
     * @name TodoEditor#MODE_ADD
     * @type Number
     * @constant
     */
    TodoEditor.MODE_ADD = 1;

    /**
     * Editor mode, means - editing existing to-do item
     *
     * @name TodoEditor#MODE_EDIT
     * @type Number
     * @constant
     */
    TodoEditor.MODE_EDIT = 2;

    /**
     * Editor mode, means - adding new category
     *
     * @name TodoEditor#MODE_CAT_ADD
     * @type Number
     * @constant
     */
    TodoEditor.MODE_CAT_ADD = 3;

    /**
     * Editor mode, means - editing existing category
     *
     * @name TodoEditor#MODE_CAT_EDIT
     * @type Number
     * @constant
     */
    TodoEditor.MODE_CAT_EDIT = 4;

    /**
     * Default filter for to-do items
     *
     * @name TodoEditor#DEFAULT_FILTER
     * @type Object
     * @constant
     */
    TodoEditor.DEFAULT_FILTER = { 'completed': null };

    /**
     * Predefined value for category id for a category being created
     * @name TodoEditor#NEW_CATEGORY_ID
     * @type Number
     * @constant
     */
    TodoEditor.NEW_CATEGORY_ID = 99999999;

    return TodoEditor;
});
