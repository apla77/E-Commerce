async function produtos () {
    const produtos = await ProdutoController.findAll ();
    const divProdutos = document.getElementById ("produtos");
    for (let produto of produtos) {
        const newDiv = TagsView.appendChild ("div", divProdutos);
        newDiv.innerHTML = `
        <div class="card">  
             <a href="{% url 'produto:detalhe' ${produto.id} %}">
             <img class="card-img-top" src="${produto.imagem}" alt="${produto.nome}">
             </a>  
             <div class="card-body">
                     <h5 class="card-title">${produto.nome}</h5>
                     <p class="card-text">${produto.descricao_curta }</p>
                     <div class="container product-price-block text-center"> 
                         ${produto.get_preco_promocional_formatado ? 
                            `<span class="product-price"> +
                                ${produto.get_preco_promocional_formatado}
                            </span> 
                            <span class="product-old-price text-muted">
                                ${produto.get_preco_formatado}
                            </span> ` : `<span class="product-old-price text-muted">
                                            ${produto.get_preco_formatado}
                                          </span>`
                         } 
                          
                     </div>
             </div>
             <div class="card-footer bg-transparent border-top-light-custom text-center">
                 <a href="{% url 'produto:detalhe' ${produto.id}}" class="btn btn-primary btn-sm m-1 btn-block">
                     <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                     Comprar
                 </a>
             </div>
         </div>
        `;
    }


    /*
     <div class="card">

     {% if produto.imagem %}
     <a href="{% url 'produto:detalhe' produto.slug %}">
     <img class="card-img-top" src="{{ produto.imagem.url }}" alt="{{ produto.nome }}">
     </a>
     {% endif %}

     <div class="card-body">
     <h5 class="card-title">{{ produto.nome }}</h5>
     <p class="card-text">{{ produto.descricao_curta }}</p>
     <div class="container product-price-block text-center">
     {% if produto.preco_marketing_promocional %}
     <span class="product-price">
     {{ produto.preco_marketing_promocional|formata_preco }}
     </span>
     <span class="product-old-price text-muted">
     {{ produto.preco_marketing|formata_preco }}
     </span>
     {% else %}
     <span class="product-prece">
     {{ produto.preco_marketing|formata_preco }}
     </span>
     {% endif %}
     </div>
     </div>
     <div class="card-footer bg-transparent border-top-light-custom text-center">
     <a href="{% url 'produto:detalhe' produto.slug %}" class="btn btn-primary btn-sm m-1 btn-block">
     <i class="fa fa-shopping-cart" aria-hidden="true"></i>
     Comprar
     </a>
     </div>
     </div>*/
}
