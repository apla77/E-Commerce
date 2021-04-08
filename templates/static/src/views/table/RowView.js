class RowView extends ElementView{
    constructor (row) {
        super (row.tagName, row.attrs);
        this._rowModel = row;
        this._columns = []
    }

    get columns () {
        return this._columns;
    }

    set columns (value) {
        this._columns = value;
    }

    get rowModel (){
        return this._rowModel;
    }

    set rowModel (value) {
        this._rowModel = value;
    }
}
