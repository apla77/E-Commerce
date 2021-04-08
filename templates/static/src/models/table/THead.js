class THead extends Model{
    constructor (attrs, row) {
        super ("thead", attrs, "");
        this._row = row;
    }

    get row (){
        return this._row;
    }

    set row (value) {
        this._row = value;
    }
}
