class ColView extends ElementView{
    constructor (col) {
        super (col.tagName, col.attrs, col.value);
        const p = TagsView.create("p")
        p.textContent = col.value
        this.appendChild(p)
        this._value = p;
        this._col = col;
    }

    get colModel () {
        return this._col;
    }

    set colModel (value) {
        this._col = value;
    }

    get value () {
        return this._value;
    }

    set value (value) {
        this._value = value;
    }
}
