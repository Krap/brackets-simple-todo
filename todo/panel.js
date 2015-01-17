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
        Dialogs             = brackets.getModule('widgets/Dialogs'),
        DefaultDialogs      = brackets.getModule('widgets/DefaultDialogs'),

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
     * Show/hide to-do panel
     *
     * @memberOf TodoPanel
     * @param {Boolean} isVisible - True to show, false to hide
     */
    TodoPanel.prototype.setVisible = function (isVisible)
    {
        this._setVisible(isVisible);
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
        var that = this;

        this._callbacks = callbacks;
        this._initializePanel();

        // Create to-do editor inside panel
        this._editor = new TodoEditor(this._panel,
        {
            'onAdd':                function (categoryId, description) { that._onTodoAdd(categoryId, description); },
            'onEdit':               function (id, description, isCompleted) { that._onTodoEdit(id, description, isCompleted); },
            'onDelete':             function (id) { that._onTodoDelete(id); },
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
            'toggleCompleted':  this._panel.find('#ovk-todo-toggle-completed'),
            'settings':         this._panel.find('#ovk-todo-settings'),
            'close':            this._panel.find('.close')
        };

        this._buttons.close.click(this._callbacks.onClose);
        this._buttons.settings.click(this._callbacks.onShowSettings);
        this._buttons.reload.click(this._callbacks.onReload);
        this._buttons.toggleCompleted.click(this._callbacks.onToggleCompleted);
        this._buttons.addTodo.click(function () { that.getEditor().createTodoItem(); } );
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
        this._isCompletedTodoVisible = !!isVisible;
        this._buttons.toggleCompleted.toggleClass('completed-visible', this._isCompletedTodoVisible);

        // TODO - filter items in editor
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
     * Show/hide to-do panel
     *
     * @memberOf TodoPanel
     * @private
     * @param {Boolean} isVisible - True to show, false to hide
     */
    TodoPanel.prototype._setVisible = function (isVisible)
    {
        if (!!isVisible)
        {
            Resizer.show(this._panel);
        }
        else
        {
            Resizer.hide(this._panel);
        }
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
     * This method is called by TodoEditor, when its internal 'edit mode' is changed (e.g. user starts/finished edit)
     *
     * @memberOf TodoPanel
     * @private
     * @param {Number} mode - Edit mode of TodoEditor
     */
    TodoPanel.prototype._onEditModeChanged = function (mode)
    {
        var isControlsDisabled = (mode !== TodoEditor.MODE_IDLE);

        // Enable/disable controls in bar
        this._buttons.reload.toggleClass('disabled', isControlsDisabled);
        this._buttons.addTodo.toggleClass('disabled', isControlsDisabled);
        this._buttons.toggleCompleted.toggleClass('disabled', isControlsDisabled);
        this._buttons.settings.toggleClass('disabled', isControlsDisabled);

        // Enable/disable to-do completion checkboxes
        this._panel.find('.todo-completion input').prop('disabled', isControlsDisabled);
    };

    return TodoPanel;
});
