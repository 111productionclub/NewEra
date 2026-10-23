# Выкладка на сервер

Схема: на сервере уже работает Caddy проекта sleng (контейнер `sleng-caddy`, порты 80/443, сеть `sleng_vebsite-main_default`). Мы добавляем свой проект `newera` из двух контейнеров и один блок в Caddyfile.

```
mynewerastore.ru -> sleng-caddy (HTTPS) -> newera-web (nginx)
                                          ├── / ...................... статический сайт (frontend/out)
                                          ├── /admin/, /api/ ......... newera-backend (Django + gunicorn)
                                          ├── /media/ ................ загруженные фото
                                          └── /static/ ............... стили админки
```

Проект sleng и его база не затрагиваются: у нас свой compose, свои тома и своя база (SQLite в томе `newera_data`).

Реальные адрес сервера, порт SSH и имя пользователя в репозиторий не записываем. Ниже плейсхолдеры: `SERVER_USER`, `SERVER_IP`, `SSH_PORT`. Подставьте свои (удобнее всего завести алиас или запись в `~/.ssh/config`).

## 0. Один раз у регистратора домена

Создайте записи A для `mynewerastore.ru` и `www.mynewerastore.ru` на IP сервера. Пока DNS не обновился, Caddy не выдаст сертификат. Проверка: `dig +short mynewerastore.ru`.

## 1. Собрать сайт и отправить файлы (на вашем компьютере)

```bash
cd frontend && pnpm build && cd ..

ssh -p SSH_PORT SERVER_USER@SERVER_IP 'mkdir -p ~/newera/backend ~/newera/site'

rsync -av --delete -e "ssh -p SSH_PORT" frontend/out/ SERVER_USER@SERVER_IP:~/newera/site/
rsync -av --delete --exclude .venv --exclude db.sqlite3 --exclude media --exclude staticfiles --exclude __pycache__ \
  -e "ssh -p SSH_PORT" backend/ SERVER_USER@SERVER_IP:~/newera/backend/
rsync -av -e "ssh -p SSH_PORT" deploy/docker-compose.yml deploy/nginx.conf deploy/.env.example SERVER_USER@SERVER_IP:~/newera/
```

## 2. Настроить и запустить (на сервере)

```bash
cd ~/newera
cp .env.example .env
nano .env        # вставьте DJANGO_SECRET_KEY (команда для генерации в самом файле)
chmod 600 .env

sudo docker compose up -d --build
sudo docker compose logs --tail 30 newera-backend      # должно быть "Listening at: http://0.0.0.0:8000"
sudo docker compose exec newera-backend python manage.py createsuperuser
```

## 3. Подключить домен в Caddy (на сервере)

Это единственное изменение в проекте sleng. Делайте с бэкапом и проверкой, чтобы не уронить его сайт. Файл Caddyfile лежит в папке проекта sleng (в ней же compose), блок для вставки есть в `deploy/caddy-block.txt`.

```bash
cd ~/sleng-django
cp Caddyfile Caddyfile.bak.$(date +%F)
cat >> Caddyfile <<'BLOCK'

mynewerastore.ru {
    encode zstd gzip
    reverse_proxy newera-web:80
}

www.mynewerastore.ru {
    redir https://mynewerastore.ru{uri} permanent
}
BLOCK

sudo docker exec sleng-caddy caddy validate --config /etc/caddy/Caddyfile   # должно закончиться "Valid configuration"
sudo docker exec sleng-caddy caddy reload   --config /etc/caddy/Caddyfile   # перезагрузка без остановки
```

Если `validate` ругнулся, ничего не перезагружайте: `cp Caddyfile.bak.<дата> Caddyfile`.

**Откат** после reload: `cp Caddyfile.bak.<дата> Caddyfile`, затем снова `reload`. Контейнеры проекта newera отключаются командой `sudo docker compose down` в `~/newera` (данные в томах сохраняются).

## 4. Проверка

1. До обновления DNS можно проверить через IP: `curl -k --resolve mynewerastore.ru:443:127.0.0.1 https://mynewerastore.ru/api/products/` (на сервере).
2. После обновления DNS: сайт `https://mynewerastore.ru/`, админка `https://mynewerastore.ru/admin/`, несуществующий адрес `/abc` показывает 404.
3. В админке добавьте товар с фото, фото должно открываться по `/media/...`.

## Обновления

- Новая версия сайта: шаг 1 (`pnpm build` и `rsync` в `site/`), перезапуск не нужен.
- Новая версия бэкенда: `rsync` backend, затем `sudo docker compose up -d --build`.

## Резервные копии

Данные лежат в томах Docker: `newera_data` (база SQLite) и `newera_media_data` (фото). Копия товаров:

```bash
sudo docker compose exec newera-backend python manage.py dumpdata products --indent 2 > ~/newera-products-$(date +%F).json
```
Фото копируются с тома `newera_media_data` (`sudo docker volume inspect newera_media_data` покажет путь).
