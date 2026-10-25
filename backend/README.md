# Бэкенд NewEra

Django + Django REST Framework. Админка для управления товарами и API, которое отдаёт их сайту.

## Запуск для разработки

```bash
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py seed_products      # 4 стартовых товара из прототипа
.venv/bin/python manage.py createsuperuser    # логин и пароль админа
.venv/bin/python manage.py runserver          # http://localhost:8000
```

- Админка: http://localhost:8000/admin/
- API: http://localhost:8000/api/products/ и http://localhost:8000/api/products/<slug>/

## Что умеет админка

Добавлять, менять и скрывать товары: название, цена, категория, наличие, размеры (через запятую), описание (каждая строка отдельно), ссылка на товар в VK, порядок в каталоге. Фото загружаются прямо в карточке товара, первое фото главное, порядок задаётся числом. Цену, наличие, порядок и «Показывать на сайте» можно менять прямо в списке товаров.

## Фото

Загружать можно любое фото до 30 МБ (JPEG, PNG, WebP). При сохранении рядом с оригиналом появляются три сжатые копии WebP: `_400`, `_800` и `_1600` пикселей по длинной стороне (решение D-19). Сайт берёт их, оригинал не отдаётся.

Фото, загруженные раньше, пережимаются командой (уже готовые пропускаются, `--force` пересоздаёт все):

```bash
.venv/bin/python manage.py optimize_images
```

## API

Только чтение. Ответ совпадает с типом `Product` из `frontend/src/types/product.ts` (`id`, `slug`, `name`, `price`, `category`, `status`, `images`, `sizes`, `description`, `vkUrl`), так что фронтенду достаточно сменить источник данных. Скрытые товары (`is_published` выключен) в API не попадают.

## Тесты

```bash
.venv/bin/python manage.py test
```

## Запуск на сервере

1. Переменные окружения из `.env.example`: обязательно `DJANGO_DEBUG=0`, `DJANGO_SECRET_KEY` (длинная случайная строка), `DJANGO_ALLOWED_HOSTS` и `CSRF_TRUSTED_ORIGINS` с адресом админки.
2. `manage.py collectstatic` и отдача `staticfiles/` веб-сервером (стили админки).
3. Папку `media/` (загруженные фото) отдаёт веб-сервер по адресу `/media/`, её нужно сохранять при обновлениях.
4. Запуск приложения через gunicorn или uWSGI за nginx/Apache. База: SQLite годится для старта, позже Postgres (изменить `DATABASES` в `config/settings.py`).
