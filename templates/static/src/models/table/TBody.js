class TBody extends Model{
    constructor (attrs, rows) {
        super ("tbody", attrs, "");
        this._rows = rows;
    }

    get rows (){
        return this._rows;
    }

    set rows (value) {
        this._rows = value;
    }
}
