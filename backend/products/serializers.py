from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """Отдаёт товар в том же виде, что тип Product во фронтенде (frontend/src/types/product.ts)."""

    id = serializers.CharField(source="slug")
    images = serializers.SerializerMethodField()
    sizes = serializers.ListField(source="sizes_list", child=serializers.CharField())
    description = serializers.ListField(source="description_lines", child=serializers.CharField())
    vkUrl = serializers.CharField(source="vk_url")

    class Meta:
        model = Product
        fields = ("id", "slug", "name", "price", "category", "status", "images", "sizes", "description", "vkUrl")

    def get_images(self, obj):
        request = self.context.get("request")
        urls = [img.image.url for img in obj.images.all()]
        return [request.build_absolute_uri(u) for u in urls] if request else urls
