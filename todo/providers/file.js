/**
 * @fileOverview A to-do items provider which stores to-do list in text file
 * @author Oleg Koshelnikov
 * @license MIT
 */

/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, $, brackets */

define(function(require)
{
    'use strict';

    var ProjectManager  = brackets.getModule('project/ProjectManager'),
        FileUtils       = brackets.getModule('file/FileUtils'),
        FileSystem      = brackets.getModule('filesystem/FileSystem'),
        FileSystemError = brackets.getModule('filesystem/FileSystemError'),

        TodoList        = require('todo/todo_list'),
        Category        = require('todo/category'),
        TodoItem        = require('todo/todo_item'),
        Strings         = require('todo/strings');

    /**
     * Create new FileTodoProvider
     *
     * @constructor
     * @class FileTodoProvider
     * @param {Object} settings - FileTodoProvider's settings: {@link FileTodoProvider#settings }
     */
    function FileTodoProvider(settings)
    {
        this._todoList = new TodoList();

        this.applySettings(settings);
        this._initializeTodoFile();
    }

    /**
     * Read and return to-do list from file
     *
     * @memberOf FileTodoProvider
     * @returns {$.Promise} Promise that will be resolved in {@link TodoList} when file read and parsing completes, or rejected with an error description
     */
    FileTodoProvider.prototype.getTodoList = function ()
    {
        var result = $.Deferred(), that = this;

        this._readTodoFile().done(function (contents)
        {
            that._cacheTodoList(that._parseTodoFile(contents));
            result.resolve(that._getCachedTodoList());
        })
        .fail(function (error)
        {
            result.reject(error);
        });

        return result.promise();
    };

    /**
     * Add new to-do item to given category. To-do list will be saved to file immediately.
     *
     * @memberOf FileTodoProvider
     * @param   {Number}    categoryId - Id of the target category
     * @param   {TodoItem}  todo       - To-do item to add
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    FileTodoProvider.prototype.addTodo = function (categoryId, todo)
    {
        if (!this._getCachedTodoList().addTodo(categoryId, todo))
        {
            return $.Deferred().reject(Strings.FILE_PROVIDER_ERR_CAT_NOT_FOUND + categoryId).promise();
        }

        return this._save();
    };

    /**
     * Edit existing to-do item. To-do list will be saved to file immediately.
     *
     * @memberOf FileTodoProvider
     * @param   {Number}    id          - To-do item identifier
     * @param   {Boolean}   isCompleted - New completion status, or null if not changed
     * @param   {String}    description - New description, or null if not changed
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    FileTodoProvider.prototype.editTodo = function (id, isCompleted, description)
    {
        if (this._getCachedTodoList().editTodo(id, isCompleted, description))
        {
             return this._save();
        }
        else
        {
            return $.Deferred().reject(Strings.FILE_PROVIDER_ERR_TODO_NOT_FOUND + id).promise();
        }
    };

    /**
     * Delete existing to-do item. To-do list will be saved to file immediately.
     *
     * @memberOf FileTodoProvider
     * @param   {Number|Array}    id - To-do item identifier or an Array of identifiers
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    FileTodoProvider.prototype.deleteTodo = function (id)
    {
        if (this._getCachedTodoList().deleteTodo(id))
        {
            return this._save();
        }
        else
        {
            return $.Deferred().reject(Strings.FILE_PROVIDER_ERR_TODO_NOT_FOUND + id).promise();
        }
    };

    /**
     * Add new to-do category. To-do list will be saved to file immediately.
     *
     * @memberOf FileTodoProvider
     * @param   {String}   name - Category name
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    FileTodoProvider.prototype.addCategory = function (name)
    {
        this._getCachedTodoList().addCategory(name);

        return this._save();
    };

    /**
     * Edit existing category. To-do list will be saved to file immediately.
     *
     * @memberOf FileTodoProvider
     * @param   {Number}    id   - Category identifier
     * @param   {String}    name - New category name
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    FileTodoProvider.prototype.editCategory = function (id, name)
    {
        if (this._getCachedTodoList().editCategory(id, name))
        {
            return this._save();
        }
        else
        {
            return $.Deferred().reject(Strings.FILE_PROVIDER_ERR_CAT_NOT_FOUND + id).promise();
        }
    };

    /**
     * Delete existing category and all to-do items it contains. To-do list will be saved to file immediately.
     *
     * @memberOf FileTodoProvider
     * @param   {Number}    id Category identifier
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    FileTodoProvider.prototype.deleteCategory = function (id)
    {
        if (this._getCachedTodoList().deleteCategory(id))
        {
            return this._save();
        }
        else
        {
            return $.Deferred().reject(Strings.FILE_PROVIDER_ERR_CAT_NOT_FOUND + id).promise();
        }
    };

    /**
     * This method is called to notify FileTodoProvider that current Brackets project has been changed
     *
     * @memberOf FileTodoProvider
     */
    FileTodoProvider.prototype.onProjectChanged = function ()
    {
        this._initializeTodoFile();
    };

    /**
     * This method is called to notify FileTodoProvider that its settings has been changed
     *
     * @memberOf FileTodoProvider
     * @param {FileTodoProvider#settings} settings - New settings of FileTodoProvider
     */
    FileTodoProvider.prototype.applySettings = function (settings)
    {
        this._applySettings(settings);
    };

    /**
     * Definition of settings specific to FileTodoProvider
     *
     * @name FileTodoProvider#settings
     * @type Object
     * @readonly
     */
    FileTodoProvider.settings =
    {
        'PROVIDER_NAME':    Strings.SETTINGS_FILE_PROVIDER_NAME,
        'SETTINGS_ID':      'text-file-storage',
        'PARAMETERS':
        [
            { 'NAME': Strings.FILE_PROVIDER_FILE_NAME,          'ID': 'todo-file',      'TYPE': 'string', 'DEFAULT': 'todo.txt' },
            { 'NAME': Strings.FILE_PROVIDER_CATEGORY_PREFIX,    'ID': 'todo-category',  'TYPE': 'string', 'DEFAULT': '# ' },
            { 'NAME': Strings.FILE_PROVIDER_COMPLETED_PREFIX,   'ID': 'todo-complete',  'TYPE': 'string', 'DEFAULT': '+ ' },
            { 'NAME': Strings.FILE_PROVIDER_INCOMPLETE_PREFIX,  'ID': 'todo-incomplete','TYPE': 'string', 'DEFAULT': '- ' }
        ],
        'VALIDATE': function (parameters)
        {
            if (parameters['todo-file'].trim().length === 0)
            {
                return Strings.FILE_PROVIDER_ERR_FILENAME_EMPTY;
            }

            if (parameters['todo-category'].trim().length === 0)
            {
                return Strings.FILE_PROVIDER_ERR_CAT_MARKER_EMPTY;
            }

            if (parameters['todo-complete'].trim().length === 0 ||
                parameters['todo-incomplete'].trim().length === 0)
            {
                return Strings.FILE_PROVIDER_ERR_MARKER_EMPTY;
            }

            function distinct(prefix1, prefix2)
            {
                return (prefix1 !== prefix2) && (prefix1.indexOf(prefix2) !== 0) && (prefix2.indexOf(prefix1) !== 0);
            }

            if (!distinct(parameters['todo-complete'], parameters['todo-incomplete']) ||
                !distinct(parameters['todo-category'], parameters['todo-complete']) ||
                !distinct(parameters['todo-category'], parameters['todo-incomplete']))
            {
                return Strings.FILE_PROVIDER_ERR_MARKERS_SAME;
            }
        }
    };

    /****************************** PRIVATE ******************************/

    /**
     * Initialize FileTodoProvider's internal variables related to to-do file.
     * This method should only be called during construction and when to-do file name changes
     *
     * @memberOf FileTodoProvider
     * @private
     */
    FileTodoProvider.prototype._initializeTodoFile = function ()
    {
        // For now to-do file name is always project-relative
        this._todoFileFullPath = ProjectManager.getProjectRoot().fullPath + this._todoFileName;
        this._todoFile = FileSystem.getFileForPath(this._todoFileFullPath);
    };

    /**
     * Get current cached to-do list
     *
     * @memberOf FileTodoProvider
     * @private
     * @returns {TodoList} Current cached to-do list
     */
    FileTodoProvider.prototype._getCachedTodoList = function ()
    {
        return this._todoList;
    };

    /**
     * Cache given to-do list internally
     *
     * @memberOf FileTodoProvider
     * @private
     * @param {TodoList} todoList - TodoList to cache
     */
    FileTodoProvider.prototype._cacheTodoList = function (todoList)
    {
        this._todoList = todoList;
    };

    /**
     * Read and return raw contents of the to-do file
     *
     * @memberOf FileTodoProvider
     * @private
     * @returns {$.Promise} Promise that will be resolved in file contents, or rejected with an error description
     */
    FileTodoProvider.prototype._readTodoFile = function ()
    {
        var read    = FileUtils.readAsText(this._todoFile),
            result  = $.Deferred(),
            that    = this;

        read.done(function (contents)
        {
            result.resolve(contents);
        })
        .fail(function (error)
        {
            if (error !== FileSystemError.NOT_FOUND)
            {
                result.reject(Strings.FILE_PROVIDER_ERR_READ_FAILED + ': ' + FileUtils.getFileErrorString(error) + ' ' + Strings.FILE_PROVIDER_FILE_NAME + ': ' + that._todoFileFullPath);
            }
            else
            {
                // Todo file does not exist yet. Since this is not an error - resolve promise with nothing
                result.resolve('');
            }
        });

        return result.promise();
    };

    /**
     * Parse file content and build a TodoList from it
     *
     * @memberOf FileTodoProvider
     * @private
     * @param   {String} contents - Raw file content
     * @returns {TodoList} TodoList build from file content
     */
    FileTodoProvider.prototype._parseTodoFile = function (contents)
    {
        var lines               = contents.split('\n'),
            todoList            = new TodoList(),
            currentCategoryId   = Category.INVALID_ID,
            i, line, isCompleted, category, description;

        // Parse file contents line by line
        for (i = 0; i < lines.length; ++i)
        {
            line = lines[i].replace(/[\r\t]/g, ' ').trim();

            // Parse line
            if (line.length > 0)
            {
                if (line.indexOf(this._markers.category) === 0)
                {
                    // Line is a category name
                    category = line.substr(this._markers.category.length).trim();

                    if (category.length > 0)
                    {
                        currentCategoryId = todoList.addCategory(category).getId();
                    }
                }
                else
                {
                    // Line is a to-do item
                    isCompleted = (line.indexOf(this._markers.completed) === 0) ? true : ((line.indexOf(this._markers.incomplete) === 0) ? false : null);

                    if (isCompleted !== null)
                    {
                        description = line.substr(isCompleted ? this._markers.completed.length : this._markers.incomplete.length).trim();

                        if (description.length > 0)
                        {
                            todoList.addTodo(currentCategoryId, new TodoItem(description, isCompleted));
                        }
                    }
                }
            }
        }

        return todoList;
    };

    /**
     * Write current cached to-do list to file
     *
     * @memberOf FileTodoProvider
     * @private
     * @returns {$.Promise} Promise that will be resolved on success, or rejected with error description on failure
     */
    FileTodoProvider.prototype._save = function ()
    {
        var result  = $.Deferred(),
            write   = FileUtils.writeText(this._todoFile, this._buildFileContents(this._getCachedTodoList())),
            that    = this;

        write.done(function ()
        {
            result.resolve();
        })
        .fail(function (error)
        {
            result.reject(Strings.FILE_PROVIDER_ERR_WRITE_FAILED + ': ' + FileUtils.getFileErrorString(error) + ' ' + Strings.FILE_PROVIDER_FILE_NAME + ': ' + that._todoFileFullPath);
        });

        return result.promise();
    };

    /**
     * Generate textual content of to-do file from a given TodoList
     *
     * @memberOf FileTodoProvider
     * @private
     * @param   {TodoList} todoList - TodoList object
     * @returns {String}   Generated file content
     */
    FileTodoProvider.prototype._buildFileContents = function (todoList)
    {
        var that        = this,
            result      = '',
            ENDLINE     = (FileUtils.getPlatformLineEndings() === FileUtils.LINE_ENDINGS_LF ? '\n' : '\r\n'),
            categories  = todoList.getCategoriesList(), i;

        // Make sure that 'uncategorized' category is always first
        if (categories.length > 0 && categories[0].getId() !== Category.INVALID_ID)
        {
            for (i = 0; i < categories.length; ++i)
            {
                if (categories[i].getId() === Category.INVALID_ID)
                {
                    categories.unshift(categories[i]);
                    categories.splice(i + 1, 1);
                    break;
                }
            }
        }

        // Build each category
        $.each(categories, function(index, category)
        {
            if (category.getId() !== Category.INVALID_ID)
            {
                result += that._markers.category + category.getName() + ENDLINE;
            }

            $.each(todoList.getTodoListForCategory(category.getId()), function (index, todo)
            {
                result += (todo.isCompleted() ? that._markers.completed : that._markers.incomplete) + todo.getDescription() + ENDLINE;
            });

            result += ENDLINE;
        });

        return result;
    };

    /**
     * This method is called to notify FileTodoProvider that its settings has been changed
     *
     * @memberOf FileTodoProvider
     * @private
     * @param {FileTodoProvider#settings} settings - New settings of FileTodoProvider
     */
    FileTodoProvider.prototype._applySettings = function (settings)
    {
        this._todoFileName = settings['todo-file'];
        this._markers = { 'completed': settings['todo-complete'], 'incomplete': settings['todo-incomplete'], 'category': settings['todo-category'] };
        this._initializeTodoFile();
    };

    return FileTodoProvider;
});
