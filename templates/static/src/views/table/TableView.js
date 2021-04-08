class TableView extends ElementView {
    constructor (tableModel, theadView, tbodyView, tfooterView) {
        super ("table", tableModel.attrs);
        if (theadView) {
            this.appendChild(theadView.element);
        }

        if (tbodyView) {
            this.appendChild(tbodyView.element);
        }

        if (tfooterView) {
            this.appendChild(tfooterView.element);
        }
        this._tableModel = tableModel;
        this._theadView = theadView;
        this._tbodyView = tbodyView;
        this._tfooterView = tfooterView;
    }

    get tableModel () {
        return this._tableModel;
    }

    set tableModel (value) {
        this._tableModel = value;
    }

    get theadView () {
        return this._theadView;
    }

    set theadView (value) {
        this._theadView = value;
    }

    get tbodyView () {
        return this._tbodyView;
    }

    set tbodyView (value) {
        this._tbodyView = value;
    }

    get tfooterView () {
        return this._tfooterView;
    }

    set tfooterView (value) {
        this._tfooterView = value;
    }
}
