# Assert

The `Assert` class is the primary export of **assertly**. An instance of this class is
created by the `expect` static method:

    class Assert {
        static expect (value) {
            return new this(value);  // use "this" to support derived classes
        }

        // ...
    }
