/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, brackets, $, Mustache */

define(function(require)
{
    'use strict';

    var Dialogs             = brackets.getModule('widgets/Dialogs'),
        DefaultDialogs      = brackets.getModule('widgets/DefaultDialogs'),

        Strings             = require('todo/strings'),
        Settings            = require('todo/settings'),

        settingsDialogHtml  = require('text!html/settings_dialog.html'),

        dialog,
        providers,
        deleteCompletedWarningShown;

    function resetDialog()
    {
        deleteCompletedWarningShown = false;

        $('#ovk-settings-delete-completed').prop('checked', Settings.get(Settings.DELETE_COMPLETED_TODO));
        $('#ovk-settings-toggle-panel-hotkey').val(Settings.get(Settings.TOGGLE_PANEL_HOTKEY));
        $('#ovk-settings-add-todo-hotkey').val(Settings.get(Settings.ADD_TODO_HOTKEY));

        $.each(providers, function (index, definition)
        {
            var settings = Settings.getProviderSettings(definition);

            if (definition.CUSTOM_TEMPLATE)
            {
                definition.CUSTOM_TEMPLATE.SET(dialog.getElement(), settings);
            }
            else
            {
                $.each(settings, function (index, value)
                {
                    var globalId = '#ovk-param-' + definition.SETTINGS_ID + '-' + index;
                    dialog.getElement().find(globalId).val(value);
                });
            }
        });
    }

    function acceptSettings(promise)
    {
        var providersSettings = [],
            isDeleteCompleted = $('#ovk-settings-delete-completed').is(':checked'),
            validationError;

        // If user checks 'Delete completed to-do', warn him that all existing completed to-do will be permanently deleted
        if (!!isDeleteCompleted && !Settings.get(Settings.DELETE_COMPLETED_TODO) && !deleteCompletedWarningShown)
        {
            dialog.getElement().find('.ovk-settings-body').append('<div class="alert" style="margin: 15px" id="ovk-settings-error">' + Strings.SETTINGS_CONFIRM_DELETE_COMPLETED + '</div>');
            deleteCompletedWarningShown = true;
            return;
        }

        $.each(providers, function (index, definition)
        {
            var settings = {};

            if (definition.CUSTOM_TEMPLATE)
            {
                settings = definition.CUSTOM_TEMPLATE.GET(dialog.getElement());
            }
            else
            {
                $.each(definition.PARAMETERS, function (index, value)
                {
                    var globalId = '#ovk-param-' + definition.SETTINGS_ID + '-' + value.ID;
                    settings[value.ID] = dialog.getElement().find(globalId).val();
                });
            }

            providersSettings.push({ 'definition': definition, 'settings': settings });

            if (!validationError)
            {
                validationError = definition.VALIDATE(settings);
            }
        });

        if (validationError)
        {
            if ($('#ovk-settings-error'))
            {
                $('#ovk-settings-error').remove();
            }

            dialog.getElement().find('.ovk-settings-body').append('<div class="alert" style="margin: 15px" id="ovk-settings-error">' + validationError + '</div>');
        }
        else
        {
            $.each(providersSettings, function (index, value)
            {
                Settings.setProviderSettings(value.definition, value.settings);
            });

            Settings.set(Settings.CURRENT_PROVIDER, $('#ovk-simple-todo-settings-provider-id').val());
            Settings.set(Settings.DELETE_COMPLETED_TODO, isDeleteCompleted);
            Settings.set(Settings.TOGGLE_PANEL_HOTKEY, $('#ovk-settings-toggle-panel-hotkey').val());
            Settings.set(Settings.ADD_TODO_HOTKEY, $('#ovk-settings-add-todo-hotkey').val());
            Settings.save();
            promise.resolve();
            dialog.close();
        }
    }

    function declineSettings(promise)
    {
        dialog.close();
        promise.reject();
    }

    function show(definitions)
    {
        var providersArray      = [],
            selectedTabId       = '#ovk-tab-settings-general',
            selectedProviderId  = Settings.get(Settings.CURRENT_PROVIDER),
            result              = $.Deferred();

        providers = definitions;

        $.each(definitions, function (index, val)
        {
            var settings = $.extend({}, val), i;

            for (i = 0; i < settings.PARAMETERS.length; ++i)
            {
                settings.PARAMETERS[i]['TYPE_' + settings.PARAMETERS[i].TYPE.toUpperCase()] = true;
            }

            settings.SELECTED = (selectedProviderId === settings.SETTINGS_ID);
            settings.HAS_CUSTOM_TEMPLATE = false;

            if (settings.CUSTOM_TEMPLATE)
            {
                settings.RENDERED_CUSTOM_HTML = settings.CUSTOM_TEMPLATE.RENDER();
                settings.HAS_CUSTOM_TEMPLATE = true;
            }

            providersArray.push({ 'provider': settings });
        });

        dialog = Dialogs.showModalDialogUsingTemplate(Mustache.render(settingsDialogHtml, { 'Strings': Strings, 'Providers': providersArray }), false);

        resetDialog();

        dialog.getElement()
            .on('click', '#ovk-settings-reset', resetDialog)
            .on('click', '#ovk-settings-accept', function () { acceptSettings(result); })
            .on('click', '#ovk-settings-decline', function () { declineSettings(result); })
            .on('click', '#ovk-nav-settings-general', function ()
            {
                $(selectedTabId).removeClass('active');
                selectedTabId = '#ovk-tab-settings-general';
                $(selectedTabId).addClass('active');
            });

        $.each(definitions, function (i, val)
        {
            dialog.getElement().on('click', '#ovk-nav-' + val.SETTINGS_ID, function ()
            {
                $(selectedTabId).removeClass('active');
                selectedTabId = '#ovk-tab-' + val.SETTINGS_ID;
                $(selectedTabId).addClass('active');
            });
        });

        return result.promise();
    }

    return {
        'show': show
    };
});
