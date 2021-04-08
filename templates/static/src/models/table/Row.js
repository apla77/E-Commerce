class Row extends Model{
    constructor (tagName, attrs, value, columns) {
        super (tagName, attrs, value);
        this._columns = columns;
    }

    get columns (){
        return this._columns;
    }

    set columns (value) {
        this._columns = value;
    }
}
