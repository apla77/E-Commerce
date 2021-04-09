class ProdutoController {
    static findAll = async (divProdutos) =>{
        let produtos = []
        const uri = "/produtos/"
        await RequestController.get(uri, null, (data)=>{
            for (let prod of data){
                produtos.push(new Produto(prod))
            }

            return produtos;
        }, () => produtos = [])
        console.log(produtos)
        ProdutoView.findAll(produtos, divProdutos)
    }
}
