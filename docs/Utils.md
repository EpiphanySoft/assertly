# Utils

## inspect

**`inspect (object, options)`**

Returns a human-readable string form of the `object` (similar to JSON but nicer).

Valid options are:

 - `showHidden` (`false`) If true, the object's non-enumerable symbols and properties will be included in the formatted result.
 - `depth` (2) Specifies the number of times to recurse while formatting the object. This is useful for inspecting large complicated objects. To make it recurse indefinitely pass null.
 - `colors` (`false`) If true, the output will be styled with ANSI color codes. Colors are customizable, see Customizing util.inspect colors.
 - `customInspect` (`true`) If false, then custom inspect(depth, opts) functions exported on the object being inspected will not be called.
 - `showProxy` (`false`) If true, then objects and functions that are Proxy objects will be introspected to show their target and handler objects.
 - `maxArrayLength` (100) Specifies the maximum number of array and TypedArray elements to include when formatting. Set to null to show all array elements. Set to 0 or negative to show no array elements.
 - `breakLength` (60) The length at which an object's keys are split across multiple lines. Set to Infinity to format an object as a single line.

When running on Node.js, this method is assigned to the `util` module's version. For
browsers, this method is an extracted version of Node.js's
[inspect](https://nodejs.org/api/util.html#util_util_inspect_object_options) method.

**Note:** At present `showProxy` is not supported in the browser because it relies on
direct access to the JavaScript engine.

## isArrayLike

**`isArrayLike (value)`**

Returns `true` if the value has a `length` property and should be treated like an
`Array`. For example, an `arguments` object.

# isEqual

**`isEqual (value1, value2, strict)`**

Recursively compares two values for equality (`==`) or `strict` equality (`===`). If
the values are both arrays or objects, their contents are compared. In other words,
when `strict` is `true` this method does not compare object references but rather
contents.

Objects and arrays must have the properties that match the same `isEqual` criteria.

Objects are considered equal if they have the same prototype and keys (regardless
of order).

# isPromise

**`isPromise (...values)`**

Returns `true` if any of the `values` are promises (have `then` methods).

# toArray

**`toArray (value)`**

If `value` is an array, it is returned. If it `isArrayLike` it is converted to a
true array (its elements are shallow copied).

Otherwise, this method returns an empty array if value is `null` or `undefined`, or
an array with the `value`.

# typeOf

**`typeOf (value)`**

This is an enhanced `typeof` replacement. It returns the same results for these
types:

 - boolean
 - function
 - number
 - string
 - undefined

Otherwise, it returns strings derived from `Object.prototype.toString` (and
caches them) such as these:

 - array
 - arguments
 - date
 - error
 - regexp
 - null

More specifically, if the string returned by `Object.prototype.toString` matches
the typical `"[object Foo]"` format, the "Foo" is extracted and `toLowerCase()` is
applied for the result. Otherwise, the text from `Object.prototype.toString` is
returned.
