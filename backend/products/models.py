from django.core.exceptions import ValidationError
from django.db import models


class Product(models.Model):
    class Category(models.TextChoices):
        TOP = "top", "Верхняя одежда"
        BOTTOM = "bottom", "Нижняя одежда"
        ACCESSORIES = "accessories", "Аксессуары"

    class Status(models.TextChoices):
        IN_STOCK = "in-stock", "В наличии"
        FEW_LEFT = "few-left", "Мало осталось"
        SOLD_OUT = "sold-out", "Нет в наличии"

    slug = models.SlugField(
        "Адрес страницы", unique=True,
        help_text="Латиницей, без пробелов. Это часть ссылки: /products/<адрес>. После публикации лучше не менять.",
    )
    name = models.CharField("Название", max_length=200)
    price = models.PositiveIntegerField("Цена, ₽")
    category = models.CharField("Категория", max_length=20, choices=Category.choices)
    status = models.CharField("Наличие", max_length=20, choices=Status.choices, default=Status.IN_STOCK)
    sizes = models.CharField(
        "Размеры", max_length=200, blank=True,
        help_text="Через запятую, например: baby, big, overbig. Пусто, если размеров нет.",
    )
    description = models.TextField(
        "Описание", blank=True,
        help_text="Каждая строка станет отдельной строчкой на странице товара.",
    )
    vk_url = models.URLField("Ссылка на товар в VK", blank=True)
    is_published = models.BooleanField("Показывать на сайте", default=True)
    order = models.PositiveIntegerField("Порядок", default=0, help_text="Меньше число, выше в каталоге.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "товар"
        verbose_name_plural = "товары"

    def __str__(self):
        return self.name

    @property
    def sizes_list(self):
        return [s.strip() for s in self.sizes.split(",") if s.strip()]

    @property
    def description_lines(self):
        return [line.strip() for line in self.description.splitlines() if line.strip()]


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField("Фото", upload_to="products/")
    order = models.PositiveIntegerField("Порядок", default=0, help_text="Первое фото главное.")

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "фото"
        verbose_name_plural = "фотографии"

    def __str__(self):
        return f"{self.product.name}: фото {self.pk}"

    def clean(self):
        if self.image and self.image.size > 10 * 1024 * 1024:
            raise ValidationError({"image": "Файл больше 10 МБ. Сожмите фото перед загрузкой."})
