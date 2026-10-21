from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "NewEra: админка"
admin.site.site_title = "NewEra"
admin.site.index_title = "Управление магазином"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("products.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
