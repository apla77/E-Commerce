async function produtos () {
    await ProdutoController.findAll (document.getElementById ("produtos"));
}
