/**
 * @fileOverview A representation of a categorized to-do list
 * @author Oleg Koshelnikov
 * @license MIT
 */

/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define */

define(function(require)
{
    'use strict';

    var Category = require('todo/category'),
        TodoItem = require('todo/todo_item');

    /**
     * Create new to-do list
     *
     * @constructor
     * @class TodoList
     */
    function TodoList()
    {
        this._categories = [];
        this._nextCategoryId = Category.INVALID_ID + 1;
        this._nextTodoId = TodoItem.INVALID_ID + 1;
    }

    /**
     * Add new to-do item to to-do list. The item will be inserted into given category.
     *
     * @memberOf TodoList
     * @param {Number}   categoryId - Identifier of the existing category for to-di item. Value of {@link Category#INVALID_ID} means item is uncategorized.
     * @param {TodoItem} todo       - To-do item to insert
     * @returns {TodoItem|null} Added TodoItem object, or null if operation failed
     */
    TodoList.prototype.addTodo = function (categoryId, todo)
    {
        var category = this._findCategory(categoryId);

        if (category === null && categoryId === Category.INVALID_ID)
        {
            // Create 'uncategorized' category when adding first to-do item to it
            category = this._createCategory();
        }

        if (category !== null)
        {
            return this._addTodoToCategory(category, todo);
        }
        else
        {
            return null;
        }
    };

    /**
     * Delete to-do item
     *
     * @memberOf TodoList
     * @param {Number|Array} id - Identifier of to-do item to delete, or an Array of identifiers
     * @returns {Boolean} True if all items were deleted, false otherwise
     */
    TodoList.prototype.deleteTodo = function (id)
    {
        return this._deleteTodo(id);
    };

    /**
     * Edit to-do item with given id
     *
     * @memberOf TodoList
     * @param   {Number}  id          - To-do item id
     * @param   {Boolean} isCompleted - New completion status, or null if not changed
     * @param   {String}  description - New description, or null if not changed
     * @returns {Boolean} True if item was edited, false if not found
     */
    TodoList.prototype.editTodo = function (id, isCompleted, description)
    {
        var todo = this._findTodo(id);

        if (todo !== null)
        {
            if (isCompleted !== null && todo.isCompleted() !== isCompleted)
            {
                todo.setCompleted(isCompleted);
            }

            if (description !== null && todo.getDescription() !== description)
            {
                todo.setDescription(description);
            }

            return true;
        }

        return false;
    };

    /**
     * Add new category
     *
     * @memberOf TodoList
     * @param {String} name - The name of the category
     * @returns {Category} Reference to created category
     */
    TodoList.prototype.addCategory = function (name)
    {
        return this._getCategoryFromHolder(this._createCategory(name));
    };

    /**
     * Delete category and all to-do items it contains
     *
     * @memberOf TodoList
     * @param   {Number}  id - Identifier of the category to delete
     * @returns {Boolean} True if category was deleted, false if it was not found
     */
    TodoList.prototype.deleteCategory = function (id)
    {
        return this._deleteCategory(id);
    };

    /**
     * Edit category
     *
     * @memberOf TodoList
     * @param   {Number}  id   - Identifier of the category to edit
     * @param   {String}  name - New category name
     * @returns {Boolean} True if category was edited, false if it was not found
     */
    TodoList.prototype.editCategory = function (id, name)
    {
        var category = this._findCategory(id);

        if (category !== null)
        {
            this._editCategory(category, name);
            return true;
        }

        return false;
    };

    /**
     * Get array of all categories in to-do list (including 'uncategorized' category)
     *
     * @memberOf TodoList
     * @returns {Array} Array of Category objects
     */
    TodoList.prototype.getCategoriesList = function ()
    {
        return this._getCategoriesList();
    };

    /**
     * Get array of to-do items in given category
     *
     * @memberOf TodoList
     * @param   {Number} categoryId Id of the category
     * @returns {Array}  Array of TodoItem objects, or null if the category was not found
     */
    TodoList.prototype.getTodoListForCategory = function (categoryId)
    {
        return this._getTodoListForCategory(categoryId);
    };

    /**
     * Get Category object which contains given to-do item
     *
     * @memberOf TodoList
     * @param   {Number}        todoId - To-do identifier
     * @returns {Category|null} Category object, or null if it is not found
     */
    TodoList.prototype.getCategoryContainingTodo = function (todoId)
    {
        return this._getCategoryContainingTodo(todoId);
    };

    /**
     * Get TodoItem by id
     *
     * @memberOf TodoList
     * @param   {Number}        id - TodoItem identifier
     * @returns {TodoItem|null} TodoItem object, or null if not found
     */
    TodoList.prototype.getTodoItem = function (id)
    {
        return this._findTodo(id);
    };

    /****************************** PRIVATE ******************************/

    /**
     * Get reference to Category object from given category holder
     *
     * @memberOf TodoList
     * @private
     * @param   {Object}   categoryHolder - Reference to category holder
     * @returns {Category} Extracted category
     */
    TodoList.prototype._getCategoryFromHolder = function (categoryHolder)
    {
        return categoryHolder.category;
    };

    /**
     * Get array of all categories in to-do list (including 'uncategorized' category)
     *
     * @memberOf TodoList
     * @private
     * @returns {Array} Array of Category objects
     */
    TodoList.prototype._getCategoriesList = function ()
    {
        var result = [], i;

        for (i = 0; i < this._categories.length; ++i)
        {
            result.push(this._categories[i].category);
        }

        return result;
    };

    /**
     * Get array of to-do items in given category
     *
     * @memberOf TodoList
     * @private
     * @param   {Number} categoryId Id of the category
     * @returns {Array}  Array of TodoItem objects, or null if the category was not found
     */
    TodoList.prototype._getTodoListForCategory = function (categoryId)
    {
        var category = this._findCategory(categoryId);

        if (category)
        {
            return category.todo;
        }

        return null;
    };

    /**
     * Find internal category holder by category id
     *
     * @memberOf TodoList
     * @private
     * @param   {Number} categoryId - Category identifier
     * @returns {Object} Reference to found category holder, or null if not found
     */
    TodoList.prototype._findCategory = function (categoryId)
    {
        var i;

        for (i = 0; i < this._categories.length; ++i)
        {
            if (this._categories[i].category.getId() === categoryId)
            {
                return this._categories[i];
            }
        }

        return null;
    };

    /**
     * Create new category holder
     *
     * @memberOf TodoList
     * @private
     * @param {String} [name] - New category name. If not defined - an 'uncategorized' category will be created.
     * @returns {Object} Reference to created category holder
     */
    TodoList.prototype._createCategory = function (name)
    {
        var categoryName = name || null, category;

        if (categoryName !== null)
        {
            this._categories.push({ 'category': new Category(this._nextCategoryId++, categoryName), 'todo': [] });
            return this._categories[this._categories.length - 1];
        }
        else
        {
            // Create 'uncategorized' category (if it does not exist yet)
            category = this._findCategory(Category.INVALID_ID);

            if (category === null)
            {
                this._categories.push({ 'category': new Category(), 'todo': [] });
                return this._categories[this._categories.length - 1];
            }
            else
            {
                return category;
            }
        }
    };

    /**
     * Delete category and all to-do items it contains
     *
     * @memberOf TodoList
     * @private
     * @param   {Number}  id - Identifier of the category to delete
     * @returns {Boolean} True if category was deleted, false if it was not found
     */
    TodoList.prototype._deleteCategory = function (id)
    {
        var i;

        for (i = 0; i < this._categories.length; ++i)
        {
            if (this._categories[i].category.getId() === id)
            {
                this._categories.splice(i, 1);
                return true;
            }
        }

        return false;
    };

    /**
     * Add new to-do item to given category holder
     *
     * @memberOf TodoList
     * @private
     * @param {Object}   categoryHolder - Reference to one of TodoList._categories elements
     * @param {TodoItem} todo           - To-do item to add
     * @returns {TodoItem} Added TodoItem object
     */
    TodoList.prototype._addTodoToCategory = function (categoryHolder, todo)
    {
        todo.setId(this._nextTodoId++);
        categoryHolder.todo.push(todo);
        return todo;
    };

    /**
     * Edit category
     *
     * @memberOf TodoList
     * @private
     * @param {Object} categoryHolder - Reference to one of TodoList._categories elements
     * @param {String} name           - New category name
     */
    TodoList.prototype._editCategory = function (categoryHolder, name)
    {
        categoryHolder.category.setName(name);
    };

    /**
     * Delete to-do item
     *
     * @memberOf TodoList
     * @private
     * @param {Number|Array} id - Identifier of to-do item to delete, or an Array of identifiers
     * @returns {Boolean} True if all items were deleted, false otherwise
     */
    TodoList.prototype._deleteTodo = function (id)
    {
        var idToDelete = [].concat(id), idx, i, j;

        for (i = 0; i < this._categories.length; ++i)
        {
            for (j = 0; j < this._categories[i].todo.length; ++j)
            {
                idx = idToDelete.indexOf(this._categories[i].todo[j].getId());

                if (idx !== -1)
                {
                    this._categories[i].todo.splice(j, 1);
                    idToDelete.splice(idx, 1);
                    --j;

                    if (idToDelete.length === 0)
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    /**
     * Find to-do item by id
     *
     * @memberOf TodoList
     * @private
     * @param   {Number} id - Identifier of to-do item to find
     * @returns {Object} Reference to found to-do item, null otherwise
     */
    TodoList.prototype._findTodo = function (id)
    {
        var i, j;

        for (i = 0; i < this._categories.length; ++i)
        {
            for (j = 0; j < this._categories[i].todo.length; ++j)
            {
                if (this._categories[i].todo[j].getId() === id)
                {
                    return this._categories[i].todo[j];
                }
            }
        }

        return null;
    };

    /**
     * Get Category object which contains given to-do item
     *
     * @memberOf TodoList
     * @private
     * @param   {Number}        todoId - To-do identifier
     * @returns {Category|null} Category object, or null if it is not found
     */
    TodoList.prototype._getCategoryContainingTodo = function (todoId)
    {
        var i, j;

        for (i = 0; i < this._categories.length; ++i)
        {
            for (j = 0; j < this._categories[i].todo.length; ++j)
            {
                if (this._categories[i].todo[j].getId() === todoId)
                {
                    return this._categories[i].category;
                }
            }
        }

        return null;
    };

    return TodoList;
});
