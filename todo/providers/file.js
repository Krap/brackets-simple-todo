/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, $, brackets, window, jQuery */

define(function(require)
{
    'use strict';

    var ProjectManager  = brackets.getModule('project/ProjectManager'),
        FileUtils       = brackets.getModule('file/FileUtils'),
        FileSystem      = brackets.getModule('filesystem/FileSystem'),
        FileSystemError = brackets.getModule('filesystem/FileSystemError'),

        TodoItem        = require('todo/todo_item'),
        Strings         = require('todo/strings');

    // Constructor
    function FileTodoProvider(settings)
    {
        this.applySettings(settings);
        this._initializeTodoFile();
    }

    //
    FileTodoProvider.prototype._initializeTodoFile = function ()
    {
        var projectRoot = ProjectManager.getProjectRoot().fullPath;

        this._todoFile = FileSystem.getFileForPath(projectRoot + this._todoFileName);
    };

    //
    FileTodoProvider.prototype._readTodoFile = function ()
    {
        var read    = FileUtils.readAsText(this._todoFile),
            result  = $.Deferred();

        read.done(function (contents)
        {
            result.resolve(contents);
        })
        .fail(function (error)
        {
            if (error !== FileSystemError.NOT_FOUND)
            {
                result.reject('Failed to read todo file: ' + error);
            }
            else
            {
                // Todo file does not exist yet
                result.resolve('');
            }
        });

        return result.promise();
    };

    // Build todo list from textual file contents
    FileTodoProvider.prototype._buildTodoList = function (text)
    {
        var lines = text.split('\n'), i, line;

        this._todo = [];
        this._todoId = 1;

        for (i = 0; i < lines.length; ++i)
        {
            line = lines[i].replace(/[\r\t]/g, ' ').trim();

            if (line.length > 0)
            {
                this._buildTodoItem(this._todoId++, line);
            }
        }
    };

    // Build todo item from a line
    FileTodoProvider.prototype._buildTodoItem = function (id, line)
    {
        var isCompleted  = (line.indexOf(this._markers.completed) === 0) ? true : ((line.indexOf(this._markers.incomplete) === 0) ? false : null),
            description;

        if (isCompleted !== null)
        {
            description = line.substr(isCompleted ? this._markers.completed.length : this._markers.incomplete.length).trim();

            if (description.length > 0)
            {
                this._todo.push(new TodoItem(id, description, isCompleted));
            }
        }
    };

    // Find todo item by id in internal todo list
    FileTodoProvider.prototype._findTodo = function (id)
    {
        var i;

        for (i = 0; i < this._todo.length; ++i)
        {
            if (this._todo[i].getId() === id)
            {
                return this._todo[i];
            }
        }

        return null;
    };

    // Save current todo list to file
    FileTodoProvider.prototype._save = function ()
    {
        var result  = $.Deferred(),
            write   = FileUtils.writeText(this._todoFile, this._buildFileContents());

        write.done(function ()
        {
            result.resolve();
        })
        .fail(function (error)
        {
            result.reject('Failed to write to-do file: ' + error);
        });

        return result.promise();
    };

    //
    FileTodoProvider.prototype._buildFileContents = function ()
    {
        var result = '', i;

        for (i = 0; i < this._todo.length; ++i)
        {
            result += this._buildFileLine(this._todo[i]);
        }

        return result;
    };

    //
    FileTodoProvider.prototype._buildFileLine = function (todo)
    {
        var result = todo.isCompleted() ? this._markers.completed : this._markers.incomplete;

        result += todo.getDescription();
        result += '\r\n';

        return result;
    };



    // Get list of all available todos
    FileTodoProvider.prototype.getTodoList = function ()
    {
        var result = $.Deferred(), that = this;

        this._readTodoFile().done(function (contents)
        {
            that._buildTodoList(contents);

            result.resolve(that._todo);
        })
        .fail(function (error)
        {
            result.reject(error);
        });

        return result.promise();
    };

    // Edit given todo (identified by id)
    FileTodoProvider.prototype.editTodo = function (editedTodo)
    {
        var result  = $.Deferred(),
            todo    = this._findTodo(editedTodo.getId());

        if (todo)
        {
            todo.edit(editedTodo);

            this._save()
            .done(function ()
            {
                result.resolve();
            })
            .fail(function (error)
            {
                result.reject(error);
            });
        }
        else
        {
            result.reject('To-do item with id "' + editedTodo.getId() + '" does not exist');
        }

        return result.promise();
    };

    // Add new todo
    FileTodoProvider.prototype.addTodo = function (todo)
    {
        this._todo.push(new TodoItem(this._todoId++, todo.getDescription(), todo.isCompleted()));

        return this._save();
    };

    FileTodoProvider.prototype.deleteTodo = function (id)
    {
        var result = $.Deferred(), i, idx = -1, todo;

        for (i = 0; i < this._todo.length; ++i)
        {
            if (this._todo[i].getId() === id)
            {
                idx = i;
                todo = this._todo[i];
                break;
            }
        }

        if (idx !== -1)
        {
            this._todo.splice(idx, 1);

            this._save()
            .done(function ()
            {
                result.resolve();
            })
            .fail(function (error)
            {
                this._todo.splice(idx, 0, todo);
                result.reject(error);
            });
        }
        else
        {
            result.reject('No to-do item found with id: ' + id);
        }

        return result.promise();
    };

    FileTodoProvider.prototype.applySettings = function (settings)
    {
        this._todoFileName = settings['todo-file'];
        this._initializeTodoFile();

        this._markers = { 'completed': settings['todo-complete'], 'incomplete': settings['todo-incomplete'] };
    };

    FileTodoProvider.prototype.onProjectChanged = function ()
    {
        this._initializeTodoFile();
    };

    FileTodoProvider.settings =
    {
            'PROVIDER_NAME':    Strings.SETTINGS_FILE_PROVIDER_NAME,
            'SETTINGS_ID':      'text-file-storage',
            'PARAMETERS':
            [
                { 'NAME': Strings.FILE_PROVIDER_FILE_NAME,          'ID': 'todo-file',      'TYPE': 'string', 'DEFAULT': 'todo.txt' },
                { 'NAME': Strings.FILE_PROVIDER_COMPLETED_PREFIX,   'ID': 'todo-complete',  'TYPE': 'string', 'DEFAULT': '+ ' },
                { 'NAME': Strings.FILE_PROVIDER_INCOMPLETE_PREFIX,  'ID': 'todo-incomplete','TYPE': 'string', 'DEFAULT': '- ' }
            ],
            'VALIDATE': function (parameters)
            {
                if (parameters['todo-file'].trim().length === 0)
                {
                    return Strings.FILE_PROVIDER_ERR_FILENAME_EMPTY;
                }

                if (parameters['todo-complete'].trim().length === 0 || parameters['todo-incomplete'].trim().length === 0)
                {
                    return Strings.FILE_PROVIDER_ERR_MARKER_EMPTY;
                }

                if (parameters['todo-complete'] === parameters['todo-incomplete'] ||
                    parameters['todo-complete'].indexOf(parameters['todo-']) === 0 ||
                    parameters['todo-incomplete'].indexOf(parameters['todo-complete']) === 0)
                {
                    return Strings.FILE_PROVIDER_ERR_MARKERS_SAME;
                }
            }
    };

    return FileTodoProvider;
});
