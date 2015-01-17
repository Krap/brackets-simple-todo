/**
 * @fileOverview A representation of a to-do items category
 * @author Oleg Koshelnikov
 * @license MIT
 */

/*jslint plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, white: true */
/*global define */

define(function(require)
{
    'use strict';

    /**
     * Create new to-do items category
     *
     * @constructor
     * @class Category
     * @param {Number}  [id]   - Unique category identifier
     * @param {String}  [name] - Category name
     */
    function Category(id, name)
    {
        this._id = id || Category.INVALID_ID;
        this._name = name || '';
    }

    /**
     * Get category id
     *
     * @memberOf Category
     * @returns {Number} Category identifier
     */
    Category.prototype.getId = function ()
    {
        return this._id;
    };

    /**
     * Set category id
     *
     * @memberOf Category
     * @param {Number} id - Category identifier
     */
    Category.prototype.setId = function (id)
    {
        this._id = id;
    };

    /**
     * Get category name
     *
     * @memberOf Category
     * @returns {String} Category name
     */
    Category.prototype.getName = function ()
    {
        return this._name;
    };

    /**
     * Set category name
     *
     * @memberOf Category
     * @param {String} name - Category name
     */
    Category.prototype.setName = function (name)
    {
        this._name = name;
    };

    /**
     * Special value reserved as invalid category identifier value
     *
     * @name Category#INVALID_ID
     * @type Number
     * @constant
     */
    Category.INVALID_ID = 0;

    return Category;
});
