/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define, brackets, $ */

define(function(require)
{
    'use strict';

    var Preferences         = brackets.getModule("preferences/PreferencesManager"),
        ExtPreferences      = Preferences.getExtensionPrefs('ovk.simple-todo'),

        FileTodoProvider    = require('todo/providers/file'),

        parameters          = {},
        settingsDefinition;

    function initialize()
    {
        $.each(settingsDefinition, function (index, value)
        {
            ExtPreferences.definePreference(value.name, value.type, value['default']);
        });
    }

    parameters.EXTENSION_ENABLED          = 'enabled';
    parameters.COMPLETED_TODO_VISIBLE     = 'completedVisible';
    parameters.DELETE_COMPLETED_TODO      = 'deleteCompleted';
    parameters.CURRENT_PROVIDER           = 'todoProvider';
    parameters.TOGGLE_PANEL_HOTKEY        = 'togglePanelHotkey';
    parameters.ADD_TODO_HOTKEY            = 'addTodoHotkey';

    settingsDefinition =
    [
        { 'name': parameters.EXTENSION_ENABLED,         'type': 'boolean',  'default': true },
        { 'name': parameters.COMPLETED_TODO_VISIBLE,    'type': 'boolean',  'default': true },
        { 'name': parameters.DELETE_COMPLETED_TODO,     'type': 'boolean',  'default': false },
        { 'name': parameters.CURRENT_PROVIDER,          'type': 'string',   'default': FileTodoProvider.settings.SETTINGS_ID },
        { 'name': parameters.TOGGLE_PANEL_HOTKEY,       'type': 'string',   'default': 'Ctrl-Shift-T' },
        { 'name': parameters.ADD_TODO_HOTKEY,           'type': 'string',   'default': 'Ctrl-Shift-A' }
    ];

    initialize();

    return $.extend(
    {
        'initProviderSettings': function (definition)
        {
            $.each(definition.PARAMETERS, function (index, value)
            {
                var globalId = definition.SETTINGS_ID + '-' + value.ID;
                ExtPreferences.definePreference(globalId, value.TYPE, value.DEFAULT);
            });
        },

        'getProviderSettings': function (definition)
        {
            var result = {};

            $.each(definition.PARAMETERS, function (index, value)
            {
                var globalId = definition.SETTINGS_ID + '-' + value.ID;
                result[value.ID] = ExtPreferences.get(globalId);
            });

            return result;
        },

        'setProviderSettings': function (definition, settings)
        {
            $.each(settings, function (index, value)
            {
                var globalId = definition.SETTINGS_ID + '-' + index;
                ExtPreferences.set(globalId, value);
            });
        },

        'save': function ()
        {
            ExtPreferences.save();
        },

        'get': function(name)
        {
            return ExtPreferences.get(name);
        },

        'set': function(name, value)
        {
            ExtPreferences.set(name, value);
        },

        'toggle': function(name)
        {
            this.set(name, !this.get(name));
            return this.get(name);
        }
    }, parameters);
});
