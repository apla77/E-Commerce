class Produto {
    constructor ({url, id, nome, descricao_curta, get_preco_formatado, get_preco_promocional_formatado, imagem, slug}) {
        this._url = url;
        this._id = id;
        this._nome = nome;
        this._descricao_curta = descricao_curta;
        this._get_preco_formatado = get_preco_formatado;
        this._get_preco_promocional_formatado = get_preco_promocional_formatado;
        this._imagem = imagem;
        this._slug = slug;
    }

    get slug () {
        return this._slug;
    }

    set slug (value) {
        this._slug = value;
    }

    get url () {
        return this._url;
    }

    set url (value) {
        this._url = value;
    }

    get id () {
        return this._id;
    }

    set id (value) {
        this._id = value;
    }

    get nome () {
        return this._nome;
    }

    set nome (value) {
        this._nome = value;
    }

    get descricao_curta () {
        return this._descricao_curta;
    }

    set descricao_curta (value) {
        this._descricao_curta = value;
    }

    get get_preco_formatado () {
        return this._get_preco_formatado;
    }

    set get_preco_formatado (value) {
        this._get_preco_formatado = value;
    }

    get get_preco_promocional_formatado () {
        return this._get_preco_promocional_formatado;
    }

    set get_preco_promocional_formatado (value) {
        this._get_preco_promocional_formatado = value;
    }

    get imagem () {
        return this._imagem;
    }

    set imagem (value) {
        this._imagem = value;
    }
}
