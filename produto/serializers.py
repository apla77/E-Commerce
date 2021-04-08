from rest_framework import serializers

from .models import Produto


class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['url', 'id', 'nome', 'descricao_curta',
                    'get_preco_formatado', 'get_preco_promocional_formatado']

