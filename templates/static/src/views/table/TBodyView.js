class TBodyView extends ElementView{
    constructor (tbodyModel) {
        super ('tbody', tbodyModel.attrs);
        this._tbodyModel = tbodyModel;
        this._rows = [];

        if (tbodyModel?.rows?.length > 0){
            for (let row of tbodyModel.rows){
                const rowView = new RowView(row)
                if (row?.columns?.length > 0){
                    for (let col of row.columns){
                        const colView = new ColView(col)
                        rowView.appendChild(colView.element)
                        rowView.columns.push(colView)
                    }
                }
                this._rows.push(rowView)
                this.appendChild(rowView.element)
            }
        }
    }

    get rows () {
        return this._rows;
    }

    set rows (value) {
        this._rows = value;
    }

    get tbodyModel (){
        return this._tbodyModel;
    }

    set tbodyModel (value) {
        this._tbodyModel = value;
    }

    appendChild (element) {
        super.appendChild(element);
    }
}
