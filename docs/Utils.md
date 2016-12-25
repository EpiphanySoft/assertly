# Utils

## inspect

**`inspect (object, options)`**

Returns a human-readable string form of the `object` (similar to JSON but nicer).

Valid options are:

 - `showHidden` (`false`)
 - `depth` (2)
 - `colors` (`false`)
 - `customInspect` (`true`)
 - `showProxy` (`false`)
 - `maxArrayLength` (100)
 - `breakLength` (60)

This method is an extracted version of Node.js's `inspect` method.

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

More specificly, if the string returned by `Object.prototype.toString` matches
the typical `"[object Foo]"` format, the "Foo" is extracted and `toLowerCase()` is
applied for the result. Otherwise, the text from `Object.prototype.toString` is
returned.
