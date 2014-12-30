/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, $, brackets, window, jQuery, Mustache */

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

    function TodoPanel(callbacks, isShowCompleted)
    {
        var that = this;

        this._callbacks = callbacks;
        this._isCompletedVisible = isShowCompleted;

        // Create panel and initialize callbacks
        WorkspaceManager.createBottomPanel('ovk.simple-todo.panel', $(Mustache.render(todoPanelHtml, { 'Strings': Strings })));

        this._panel = $('#ovk-simple-todo-panel');
        this._panel.on('click', '.close',                       function () { that._onClose(); });
        this._panel.on('click', '#ovk-todo-settings',           function () { that._onShowSettings(); });
        this._panel.on('click', '#ovk-todo-reload',             function () { that._onReload(); });
        this._panel.on('click', '#ovk-todo-add',                function () { that._onCreateTodo(); } );
        this._panel.on('click', '#ovk-todo-toggle-completed',   function () { that._onToggleCompleted(); } );
        this._panel.on('change', '.todo-completion input', function ()
        {
            callbacks.onCompletionChanged($(this).data('todo-id'), this.checked);
        });

        this._panel.find('#ovk-todo-toggle-completed').addClass(this._isCompletedVisible ? 'show': 'hide');

        // Create todo editor inside panel
        this._editor = new TodoEditor(this._panel,
        {
            'onAdd':            function (description) { that._onTodoAdd(description); },
            'onEdit':           function (id, description, isCompleted) { that._onTodoEdit(id, description, isCompleted); },
            'onDelete':         function (id) { that._onTodoDelete(id); },
            'onModeChanged':    function (mode) { that._onEditModeChanged(mode); }
        });
    }

    TodoPanel.prototype._onClose = function ()
    {
        this._callbacks.onClose();
    };

    TodoPanel.prototype._onReload = function ()
    {
        var that = this;

        if (this.getEditor().getMode() !== TodoEditor.MODE_IDLE)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_INFO, Strings.DIALOG_TITLE_CONFIRM_RELOAD, Strings.DIALOG_MESSAGE_CONFIRM_RELOAD,
                [{ className: Dialogs.DIALOG_BTN_CLASS_PRIMARY, id: Dialogs.DIALOG_BTN_CANCEL,   text: Strings.CANCEL },
                 { className: Dialogs.DIALOG_BTN_CLASS_LEFT,    id: Dialogs.DIALOG_BTN_DONTSAVE, text: Strings.YES_RELOAD }])
            .done(function (buttonId)
            {
                if (buttonId === Dialogs.DIALOG_BTN_DONTSAVE)
                {
                    that._callbacks.onReload();
                }
            });
        }
        else
        {
            this._callbacks.onReload();
        }
    };

    TodoPanel.prototype._onCreateTodo = function ()
    {
        this.getEditor().createTodoItem();
    };

    TodoPanel.prototype._onToggleCompleted = function ()
    {
        var classToRemove   = this._isCompletedVisible ? 'show' : 'hide',
            classToAdd      = this._isCompletedVisible ? 'hide' : 'show';

        this._isCompletedVisible = !this._isCompletedVisible;
        this._panel.find('#ovk-todo-toggle-completed').removeClass(classToRemove).addClass(classToAdd);

        this._callbacks.onToggleCompleted();
    };

    TodoPanel.prototype._onShowSettings = function ()
    {
        this._callbacks.onShowSettings();
    };

    TodoPanel.prototype._onTodoAdd = function (description)
    {
        if (description.trim().length === 0)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_ADD_TODO_FAILED, Strings.DIALOG_MESSAGE_DESCR_EMPTY);
        }
        else
        {
            this._callbacks.onTodoAdd(description);
        }
    };

    TodoPanel.prototype._onTodoEdit = function (id, description, isCompleted)
    {
        if (description.trim().length === 0)
        {
            Dialogs.showModalDialog(DefaultDialogs.DIALOG_ID_ERROR, Strings.DIALOG_TITLE_EDIT_TODO_FAILED, Strings.DIALOG_MESSAGE_DESCR_EMPTY);
        }
        else
        {
            this._callbacks.onTodoEdit(id, description, isCompleted);
        }
    };

    TodoPanel.prototype._onTodoDelete = function (id)
    {
        this._callbacks.onTodoDelete(id);
    };

    TodoPanel.prototype._onEditModeChanged = function (mode)
    {
        if (mode === TodoEditor.MODE_IDLE)
        {
            this._panel.find('#ovk-todo-add').removeClass('disabled');
            this._panel.find('#ovk-todo-toggle-completed').removeClass('disabled');
            this._panel.find('#ovk-todo-settings').removeClass('disabled');

            this._panel.find('.todo-completion input').prop('disabled', false);
        }
        else
        {
            this._panel.find('#ovk-todo-add').addClass('disabled');
            this._panel.find('#ovk-todo-toggle-completed').addClass('disabled');
            this._panel.find('#ovk-todo-settings').addClass('disabled');

            this._panel.find('.todo-completion input').prop('disabled', true);
        }
    };



    //
    TodoPanel.prototype.getEditor = function ()
    {
        return this._editor;
    };

    TodoPanel.prototype.setVisible = function (isVisible)
    {
        if (isVisible)
        {
            Resizer.show(this._panel);
        }
        else
        {
            Resizer.hide(this._panel);
        }
    };



    return TodoPanel;
});
