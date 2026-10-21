from django.contrib import admin
from django.utils.html import format_html

from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "preview", "order")
    readonly_fields = ("preview",)

    @admin.display(description="Превью")
    def preview(self, obj):
        if not obj.pk or not obj.image:
            return "—"
        return format_html('<img src="{}" style="height:80px;border-radius:6px">', obj.image.url)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "category", "status", "is_published", "order")
    list_editable = ("price", "status", "is_published", "order")
    list_filter = ("category", "status", "is_published")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]
    fieldsets = (
        (None, {"fields": ("name", "slug", "price", "category", "status", "is_published", "order")}),
        ("Страница товара", {"fields": ("sizes", "description", "vk_url")}),
    )
