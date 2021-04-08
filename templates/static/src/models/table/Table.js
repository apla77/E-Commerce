class Table extends Model{
    constructor (attrs, thead, tbody, tfooter) {
        super ("table", attrs, '');
        this._thead = thead
        this._tbody = tbody
        this._tfooter = tfooter
    }

    get thead (){
        return this._thead;
    }

    set thead (value) {
        this._thead = value;
    }

    get tbody (){
        return this._tbody;
    }

    set tbody (value) {
        this._tbody = value;
    }

    get tfooter (){
        return this._tfooter;
    }

    set tfooter (value) {
        this._tfooter = value;
    }
}
