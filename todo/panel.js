/**
 * @fileOverview Bottom panel with bar and to-do editor
 * @author Oleg Koshelnikov
 * @license MIT
 */

/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, $, brackets, Mustache */

define(function(require)
{
    'use strict';

    var WorkspaceManager    = brackets.getModule('view/WorkspaceManager'),
        Resizer             = brackets.getModule('utils/Resizer'),
        StringUtils         = brackets.getModule('utils/StringUtils'),
        Dialogs             = brackets.getModule('widgets/Dialogs'),
        DefaultDialogs      = brackets.getModule('widgets/DefaultDialogs'),
        CommandManager      = brackets.getModule('command/CommandManager'),
        KeyBindingManager   = brackets.getModule('command/KeyBindingManager'),

        Settings            = require('todo/settings'),
        Strings             = require('todo/strings'),

        TodoEditor          = require('todo/editor'),

        todoPanelHtml       = require('text!html/panel.html');

    /**
     * Create new TodoPanel
     *
     * @constructor
     * @class TodoPanel
     * @param {Object} callbacks - Callbacks to be called on some user actions
     */
    function TodoPanel(callbacks)
    {
        this._initialize(callbacks);
        this._setCompletedTodoVisibility(true);
    }

    /**
     * Set whether completed to-do items should be visible or hidden
     *
     * @memberOf TodoPanel
     * @param {Boolean} isVisible - True to show, false to hide
     */
    TodoPanel.prototype.setCompletedTodoVisibility = function (isVisible)
    {
        this._setCompletedTodoVisibility(isVisible);
    };

    /**
     * Get current completed to-do items visibility
     *
     * @memberOf TodoPanel
     * @returns {Boolean} - True if visible, false if hidden
     */
    TodoPanel.prototype.getCompletedTodoVisibility = function ()
    {
        return this._getCompletedTodoVisibility();
    };

    /**
     * Get reference to TodoEditor inside this panel
     *
     * @memberOf TodoPanel
     * @returns {TodoEditor} - Reference to TodoEditor
     */
    TodoPanel.prototype.getEditor = function ()
    {
        return this._editor;
    };

    /**
     * Enable/Disable controls on panel
     *
     * @memberOf TodoPanel
     * @param {Boolean} isEnabled - True to enable controls, false to disable
     */
    TodoPanel.prototype.setControlsEnabled = function (isEnabled)
    {
        this._setControlsEnabled(isEnabled);
    };

    /****************************** PRIVATE ******************************/

    /**
     * Initialize to-do panel
     *
     * @memberOf TodoPanel
     * @private
     * @param {Object} callbacks - Callbacks
     */
    TodoPanel.prototype._initialize = function (callbacks)
    {
        var that = this, hotkey;

        this._callbacks = callbacks;
        this._initializePanel();

        // Register Toggle Panel Command
        CommandManager.register(Strings.PANEL_TOGGLE, Strings.COMMAND_TOGGLE, function (isVisible) { that._setVisible(isVisible); });

        // Add Keybinding for Toggle Command
        hotkey = Settings.get(Settings.TOGGLE_PANEL_HOTKEY);

        if (hotkey && hotkey.length > 0)
        {
            KeyBindingManager.addBinding(Strings.COMMAND_TOGGLE, hotkey);
        }

        // Create to-do editor inside panel
        this._editor = new TodoEditor(this._panel,
        {
            'onAdd':                function (categoryId, description) { that._onTodoAdd(categoryId, description); },
            'onCategoryAdd':        function (name) { that._onCategoryAdd(name); },
            'onEdit':               function (id, description, isCompleted) { that._onTodoEdit(id, description, isCompleted); },
            'onCategoryEdit':       function (id, name) { that._onCategoryEdit(id, name); },
            'onDelete':             function (id) { that._onTodoDelete(id); },
            'onCategoryDelete':     function (id) { that._onCategoryDelete(id); },
            'onModeChanged':        function (mode) { that._onEditModeChanged(mode); },
            'onCompletionChanged':  function (id, isCompleted) { that._callbacks.onCompletionChanged(id, isCompleted); }
        });
    };

    /**
     * Initialize to-do panel UI components
     *
     * @memberOf TodoPanel
     * @private
     */
    TodoPanel.prototype._initializePanel = function ()
    {
        var that = this;

        // Create panel
        WorkspaceManager.createBottomPanel('ovk.simple-todo.panel', $(Mustache.render(todoPanelHtml, { 'Strings': Strings })));

        this._panel = $('#ovk-simple-todo-panel');

        this._buttons =
        {
            'reload':           this._panel.find('#ovk-todo-reload'),
            'addTodo':          this._panel.find('#ovk-todo-add'),
            'addCategory':      this._panel.find('#ovk-todo-cat-add'),
            'toggleCompleted':  this._panel.find('#ovk-todo-toggle-completed'),
            'settings':         this._panel.find('#ovk-todo-settings'),
            'close':            this._panel.find('.close')
        };

        this._buttons.close.click(this._callbacks.onClose);
        this._buttons.settings.click(this._callbacks.onShowSettings);
        this._buttons.reload.click(this._callbacks.onReload);
        this._buttons.toggleCompleted.click(this._callbacks.onToggleCompleted);
        this._buttons.addTodo.click(function () { that.getEditor().createTodoItem(); } );
        this._buttons.addCategory.click(function () { that.getEditor().createCategory(); } );
    };

    /**
     * Set whether completed to-do items should be visible or hidden
     *
     * @memberOf TodoPanel
     * @private
     * @param {Boolean} isVisible - True to show, false to hide
     */
    TodoPanel.prototype._setCompletedTodoVisibility = function (isVisible)
    {
        var filter = this.getEditor().getFilter();

        this._isCompletedTodoVisible = !!isVisible;
        this._buttons.toggleCompleted.toggleClass('completed-visible', this._isCompletedTodoVisible);

        filter.completed = this._isCompletedTodoVisible ? null : false;
        this.getEditor().setFilter(filter);
    };

    /**
     * Get current completed to-do items visibility
     *
     * @memberOf TodoPanel
     * @private
     * @returns {Boolean} - True if visible, false if hidden
     */
    TodoPanel.prototype._getCompletedTodoVisibility = function ()
    {
        return this._isCompletedTodoVisible;
    };

    /**
     * Function called when Command id `Strings.COMMAND_TOGGLE` is executed.
     * Default behavior is to toggle (show/hide) the to-do panel.
     * Specify `isVisible` to override the default behavior.
     *
     * @memberOf TodoPanel
     * @private
     * @param {Boolean} [isVisible] - `true` to show the panel, `false` to hide the panel
     */
    TodoPanel.prototype._setVisible = function (isVisible)
    {
        switch (isVisible)
        {
            case true:
                this._showPanel();
                break;
            case false:
                this._hidePanel();
                break;
            default:
                if (Settings.get(Settings.EXTENSION_ENABLED))
                {
                    this._hidePanel();
                }
                else
                {
                    this._showPanel();
                }
        }
    };

    /**
     * Show to-do panel and save this state to settings
     *
     * memberOf TodoPanel
     * @private
     */
    TodoPanel.prototype._showPanel = function ()
    {
        Resizer.show(this._panel);
        $('#ovk-todo-toolbar-icon').addClass('active');
        Settings.set(Settings.EXTENSION_ENABLED, true);
        Settings.save();
    };

    /**
     * Hide to-do panel and save this state to settings
     *
     * memberOf TodoPanel
     * @private
     */
    TodoPanel.prototype._hidePanel = function ()
    {
        Resizer.hide(this._panel);
        $('#ovk-todo-toolbar-icon').removeClass('active');
        Settings.set(Settings.EXTENSION_ENABLED, false);
        Settings.save();
    };

    /**
     * This method is called by TodoEditor, when user adds new to-do item
     *
     * @memberOf TodoPanel
     * @private
     * @param {Number} categoryId  - Category id
     * @param {String} description - To-do item description
     */
    TodoPanel.prototype._onTodoAdd = function (categoryId, description)
    {
        if (description.trim().length === 0)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_ADD_TODO_FAILED, Strings.DIALOG_MESSAGE_DESCR_EMPTY);
        }
        else
        {
            this._callbacks.onTodoAdd(categoryId, description);
        }
    };

    /**
     * This method is called by TodoEditor when user adds new category
     *
     * @memberOf TodoPanel
     * @private
     * @param {String} name - Category name
     */
    TodoPanel.prototype._onCategoryAdd = function (name)
    {
        if (name.trim().length === 0)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_ADD_CAT_FAILED, Strings.DIALOG_MESSAGE_CAT_NAME_EMPTY);
        }
        else
        {
            this._callbacks.onCategoryAdd(name);
        }
    };

    /**
     * This method is called by TodoEditor, when user edits existing to-do item
     *
     * @memberOf TodoPanel
     * @private
     * @param {Number}   id          - To-do item identifier
     * @param {String}   description - New to-do item description
     */
    TodoPanel.prototype._onTodoEdit = function (id, description)
    {
        if (description.trim().length === 0)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_EDIT_TODO_FAILED, Strings.DIALOG_MESSAGE_DESCR_EMPTY);
        }
        else
        {
            this._callbacks.onTodoEdit(id, description);
        }
    };

    /**
     * This method is called by TodoEditor, when user edits existing category
     *
     * @memberOf TodoPanel
     * @private
     * @param {Number} id    - Category identifier
     * @param {String} name  - New category's name
     */
    TodoPanel.prototype._onCategoryEdit = function (id, name)
    {
        if (name.trim().length === 0)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_EDIT_CAT_FAILED, Strings.DIALOG_MESSAGE_CAT_NAME_EMPTY);
        }
        else
        {
            this._callbacks.onCategoryEdit(id, name);
        }
    };

    /**
     * This method is called by TodoEditor, when user deletes existing to-do item
     *
     * @memberOf TodoPanel
     * @private
     * @param {Number} id - To-do item identifier
     */
    TodoPanel.prototype._onTodoDelete = function (id)
    {
        this._callbacks.onTodoDelete(id);
    };

    /**
     * This method is called by TodoEditor, when user deletes existing category
     *
     * @memberOf TodoPanel
     * @private
     * @param {Category} category - Category to delete
     */
    TodoPanel.prototype._onCategoryDelete = function (category)
    {
        var that = this;

        Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, Strings.DIALOG_TITLE_CONFIRM_CAT_DELETE, StringUtils.format(Strings.DIALOG_MESSAGE_CONFIRM_CAT_DELETE, category.getName()),
            [{ className: Dialogs.DIALOG_BTN_CLASS_NORMAL,  id: Dialogs.DIALOG_BTN_CANCEL,   text: Strings.CANCEL },
             { className: Dialogs.DIALOG_BTN_CLASS_PRIMARY, id: Dialogs.DIALOG_BTN_OK,       text: Strings.DELETE }])
        .done(function (buttonId)
        {
            if (buttonId === Dialogs.DIALOG_BTN_OK)
            {
                that._callbacks.onCategoryDelete(category.getId());
            }
        });
    };

    /**
     * This method is called by TodoEditor, when its internal 'edit mode' is changed (e.g. user starts/finished edit)
     *
     * @memberOf TodoPanel
     * @private
     * @param {Number} mode - Edit mode of TodoEditor
     */
    TodoPanel.prototype._onEditModeChanged = function (mode)
    {
        var isControlsEnabled = (mode === TodoEditor.MODE_IDLE);

        this._setControlsEnabled(isControlsEnabled);
    };

    /**
     * Enable/Disable controls on panel
     *
     * @memberOf TodoPanel
     * @private
     * @param {Boolean} isEnabled - True to enable controls, false to disable
     */
    TodoPanel.prototype._setControlsEnabled = function (isEnabled)
    {
        // Enable/disable controls in bar
        this._buttons.reload.toggleClass('disabled', !isEnabled);
        this._buttons.addTodo.toggleClass('disabled', !isEnabled);
        this._buttons.addCategory.toggleClass('disabled', !isEnabled);
        this._buttons.toggleCompleted.toggleClass('disabled', !isEnabled);
        this._buttons.settings.toggleClass('disabled', !isEnabled);

        // Enable/disable to-do completion checkboxes
        this._panel.find('.todo-completion input').prop('disabled', !isEnabled);
    };

    return TodoPanel;
});
