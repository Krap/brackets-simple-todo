/**
 * @fileOverview TodoManager serves as mediator, binding concrete todo providers to view
 * @author Oleg Koshelnikov
 * @license MIT
 */

/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, $, brackets */

define(function(require)
{
    'use strict';

    var Dialogs             = brackets.getModule('widgets/Dialogs'),
        DefaultDialogs      = brackets.getModule('widgets/DefaultDialogs'),

        TodoItem            = require('todo/todo_item'),
        TodoPanel           = require('todo/panel'),
        Strings             = require('todo/strings'),
        Settings            = require('todo/settings'),
        SettingsDialog      = require('todo/settings_dialog');

    /**
     * Create new TodoManager
     *
     * @constructor
     * @class TodoManager
     */
    function TodoManager()
    {
        this._initializeExtension();
    }

    /**
     * Perform startup initialization
     *
     * @memberOf TodoManager
     * @param {Array} providers - An array of available to-do providers
     */
    TodoManager.prototype.initialize = function (providers)
    {
        this._initializeTodoProviders(providers);
        this._selectTodoProvider();
        this._initializeUi();
        this._rereadTodoList();
        this._setTodoPanelVisible(Settings.get(Settings.EXTENSION_ENABLED));
    };

    /**
     * Toggle to-do panel visibility. State is saved to settings.
     * This call does not trigger any data update, i.e. this is only visibility control.
     *
     * @memberOf TodoManager
     */
    TodoManager.prototype.toggllePanelVisibility = function ()
    {
        this._setTodoPanelVisible(Settings.toggle(Settings.EXTENSION_ENABLED));
        Settings.save();
    };

    /**
     * Handle current project change
     *
     * @memberOf TodoManager
     */
    TodoManager.prototype.onProjectChanged = function ()
    {
        this._onProjectChanged();
    };

    /****************************** PRIVATE ******************************/

    /**
     * Initialize TodoManager so it will know about fiven tdo providers classes
     *
     * @memberOf TodoManager
     * @private
     * @param {Array} providers - Array of to-do providers classes
     */
    TodoManager.prototype._initializeTodoProviders = function (providers)
    {
        var i;

        for (i = 0; i < providers.length; ++i)
        {
            Settings.initProviderSettings(providers[i].settings);
        }

        this._providers = providers;
    };

    /**
     * Select current to-do provider based on user settings
     *
     * @memberOf TodoManager
     * @private
     */
    TodoManager.prototype._selectTodoProvider = function ()
    {
        var selectedProviderId = Settings.get(Settings.CURRENT_PROVIDER), providerIndex = 0, i;

        for (i = 0; i < this._providers.length; ++i)
        {
            if (this._providers[i].settings.SETTINGS_ID === selectedProviderId)
            {
                providerIndex = i;
                break;
            }
        }

        this._provider = new this._providers[providerIndex](Settings.getProviderSettings(this._providers[providerIndex].settings));
    };

    /**
     * Handle current project change
     *
     * @memberOf TodoManager
     * @private
     */
    TodoManager.prototype._onProjectChanged = function ()
    {
        if (this._provider.onProjectChanged())
        {
            this._rereadTodoList();
        }
    };

    /**
     * Initialize extension
     *
     * @memberOf TodoManager
     * @private
     */
    TodoManager.prototype._initializeExtension = function ()
    {
        var that = this;

        // Initialize extension icon
        // In future should register command amd add hotkey
        $(document.createElement('a'))
            .attr('id', TodoManager.EXTENSION_ICON_ID)
            .attr('href', '#')
            .attr('title', Strings.EXTENSION_NAME)
            .on('click', function () { that.toggllePanelVisibility(); })
            .appendTo($('#main-toolbar .buttons'));
    };

    /**
     * Initialize UI
     *
     * @memberOf TodoManager
     * @private
     */
    TodoManager.prototype._initializeUi = function ()
    {
        var that = this;

        // Initialize to-do panel
        this._panel = new TodoPanel(
        {
            'onClose':              function ()                         { that.toggllePanelVisibility(); },
            'onReload':             function ()                         { that._rereadTodoList(); },
            'onTodoAdd':            function (categoryId, description)  { that._addTodoItem(categoryId, description); },
            'onCategoryAdd':        function (name)                     { that._addCategory(name); },
            'onTodoEdit':           function (id, description)          { that._editTodoItem(id, description); },
            'onCategoryEdit':       function (id, name)                 { that._editCategory(id, name); },
            'onTodoDelete':         function (id)                       { that._deleteTodoItem(id); },
            'onCategoryDelete':     function (id)                       { that._deleteCategory(id); },
            'onCompletionChanged':  function (id, isCompleted)          { that._setTodoItemCompletion(id, isCompleted); },
            'onToggleCompleted':    function ()                         { that._toggleCompletedItemsVisibility(); },
            'onShowSettings':       function ()                         { that._showSettingsDialog(); }
        });

        this._panel.setCompletedTodoVisibility(Settings.get(Settings.COMPLETED_TODO_VISIBLE));
    };

    /**
     * Show/hide to-do panel. Does not saved to settings.
     *
     * @memberOf TodoManager
     * @private
     * @param {Boolean} isVisible - True to show panel, false to hide
     */
    TodoManager.prototype._setTodoPanelVisible = function (isVisible)
    {
        if (!!isVisible)
        {
            $('#' + TodoManager.EXTENSION_ICON_ID).addClass('active');
        }
        else
        {
            $('#' + TodoManager.EXTENSION_ICON_ID).removeClass('active');
        }

        this._panel.setVisible(!!isVisible);
    };

    /**
     * Read to-do list from to-do provider and redraw it.
     *
     * @memberOf TodoManager
     * @private
     */
    TodoManager.prototype._rereadTodoList = function ()
    {
        var that = this;

        this._provider.getTodoList()
        .done(function (todoList)
        {
            that._panel.getEditor().render(todoList);
        })
        .fail(function (error)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_LIST_TODO_FAILED, error);
        });
    };

    /**
     * Add new to-do item
     *
     * @memberOf TodoManager
     * @private
     * @param {Number} categoryId  - Id of the destination category
     * @param {String} description - To-do item's description
     */
    TodoManager.prototype._addTodoItem = function (categoryId, description)
    {
        var that = this;

        this._provider.addTodo(categoryId, new TodoItem(description))
        .done(function ()
        {
            that._rereadTodoList();
        })
        .fail(function (error)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_ADD_TODO_FAILED, error);
        });
    };

    /**
     * Add new category
     *
     * @memberOf TodoManager
     * @private
     * @param {String} name - Category name
     */
    TodoManager.prototype._addCategory = function (name)
    {
        var that = this;

        this._provider.addCategory(name)
        .done(function ()
        {
            that._rereadTodoList();
        })
        .fail(function (error)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_ADD_CAT_FAILED, error);
        });
    };

    /**
     * Edit existing to-do item
     *
     * @memberOf TodoManager
     * @private
     * @param {Number} id          - To-do item id
     * @param {String} description - New to-do item's description
     */
    TodoManager.prototype._editTodoItem = function (id, description)
    {
        var that = this;

        this._provider.editTodo(id, null, description)
        .done(function ()
        {
            that._rereadTodoList();
        })
        .fail(function (error)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_EDIT_TODO_FAILED, error);
        });
    };

    /**
     * Edit existing category
     *
     * @memberOf TodoManager
     * @private
     * @param {Number} id   - Category id
     * @param {String} name - New category name
     */
    TodoManager.prototype._editCategory = function (id, name)
    {
        var that = this;

        this._provider.editCategory(id, name)
        .done(function ()
        {
            that._rereadTodoList();
        })
        .fail(function (error)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_EDIT_CAT_FAILED, error);
        });
    };

    /**
     * Delete existing to-do item
     *
     * @memberOf TodoManager
     * @private
     * @param {Number} id - Id of the to-do item
     */
    TodoManager.prototype._deleteTodoItem = function (id)
    {
        var that = this;

        this._provider.deleteTodo(id)
        .done(function ()
        {
            that._rereadTodoList();
        })
        .fail(function (error)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_DELETE_TODO_FAILED, error);
        });
    };

    /**
     * Delete existing category
     *
     * @memberOf TodoManager
     * @private
     * @param {Number} id - Id of the category
     */
    TodoManager.prototype._deleteCategory = function (id)
    {
        var that = this;

        this._provider.deleteCategory(id)
        .done(function ()
        {
            that._rereadTodoList();
        })
        .fail(function (error)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_DELETE_CAT_FAILED, error);
        });
    };

    /**
     * Set completion status for a to-do item
     *
     * @memberOf TodoManager
     * @private
     * @param {Number}  id          - To-do item id
     * @param {Boolean} isCompleted - New completion status
     */
    TodoManager.prototype._setTodoItemCompletion = function (id, isCompleted)
    {
        if(!!isCompleted && Settings.get(Settings.DELETE_COMPLETED_TODO))
        {
            this._deleteTodoItem(id);
        }
        else
        {
            var that = this;

            this._provider.editTodo(id, isCompleted, null)
            .fail(function (error)
            {
                Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_EDIT_TODO_FAILED, error);
            })
            .always(function ()
            {
                that._rereadTodoList();
            });
        }
    };

    /**
     * Show/hide completed to-do items
     *
     * @memberOf TodoManager
     * @private
     */
    TodoManager.prototype._toggleCompletedItemsVisibility = function ()
    {
        var isVisible = Settings.toggle(Settings.COMPLETED_TODO_VISIBLE);
        Settings.save();

        this._panel.setCompletedTodoVisibility(isVisible);
    };

    /**
     * Delete all completed to-do items
     *
     * @memberOf TodoManager
     * @private
     * @returns {$.Promise} Promise object that will be resolved on success, or rejected with an error description on failure
     */
    TodoManager.prototype._deleteCompletedTodoItems = function ()
    {
        var that    = this,
            result  = $.Deferred(), i, j, categories, category, todos, todoIdsToDelete = [];

        this._provider.getTodoList()
        .done(function (todoList)
        {
            categories = todoList.getCategoriesList();

            for (i = 0; i < categories.length; ++i)
            {
                category = categories[i];
                todos = todoList.getTodoListForCategory(category.getId());

                for (j = 0; j < todos.length; ++j)
                {
                    if (todos[j].isCompleted())
                    {
                        todoIdsToDelete.push(todos[j].getId());
                    }
                }
            }

            if (todoIdsToDelete.length > 0)
            {
                that._provider.deleteTodo(todoIdsToDelete).done(function () { result.resolve(); }).fail(function (error) { result.reject(error); });
            }
            else
            {
                result.resolve();
            }
        })
        .fail(function (error)
        {
            result.reject(error);
        });

        return result;
    };

    /**
     * Show settings dialog and apply settings if user clicks "Apply"
     *
     * @memberOf TodoManager
     * @private
     */
    TodoManager.prototype._showSettingsDialog = function ()
    {
        var that = this,
            providersSettingsList = [],
            selectedProviderId = Settings.get(Settings.CURRENT_PROVIDER),
            deleteCompletedPromise = $.Deferred().resolve(), i;

        // Prepare array of settings for each provider
        for (i = 0; i < this._providers.length; ++i)
        {
            providersSettingsList.push(this._providers[i].settings);
        }

        // Show dialog
        SettingsDialog.show(providersSettingsList)
        .done(function ()
        {
            if (selectedProviderId !== Settings.get(Settings.CURRENT_PROVIDER))
            {
                that._selectTodoProvider();
            }

            // Delete completed to-do items
            if(Settings.get(Settings.DELETE_COMPLETED_TODO))
            {
                deleteCompletedPromise = that._deleteCompletedTodoItems();
            }

            // Deleting completed to-do items in async, so have to wait for completion
            deleteCompletedPromise.done(function ()
            {
                that._provider.applySettings(Settings.getProviderSettings(that._provider.constructor.settings));
                that._rereadTodoList();
            })
            .fail(function (error)
            {
                Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_DEL_COMPLETED_FAILED, error);
            });
        });
    };

    TodoManager.EXTENSION_ICON_ID = 'ovk-todo-toolbar-icon';

    return TodoManager;
});
