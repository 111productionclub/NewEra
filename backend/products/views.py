from rest_framework import generics

from .models import Product
from .serializers import ProductSerializer


def published_products():
    return Product.objects.filter(is_published=True).prefetch_related("images")


class ProductList(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return published_products()


class ProductDetail(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return published_products()
