class Model {
    constructor (tagName, attrs, value) {
        this._attrs = attrs;
        this._value = value;
        this._tagName = tagName;
    }

    get tagName () {
        return this._tagName;
    }

    set tagName (value) {
        this._tagName = value;
    }

    get value () {
        return this._value;
    }

    set value (value) {
        this._value = value;
    }

    get attrs () {
        return this._attrs;
    }

    set attrs (value) {
        this._attrs = value;
    }
}
