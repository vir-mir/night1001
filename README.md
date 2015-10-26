# night1001



## Запуск
```
virtualenv -p /usr/bin/python3.4 night1001
cd night1001
source bin/activate
git clone git@github.com:vir-mir/night1001.git night1001
cd night1001
pip install -r requirements.txt 
cp night1001/local_settings.py--local night1001/local_settings.py
vim night1001/local_settings.py // настраиваем соединение с БД
python manage.py syncdb
python manage.py runserver
python night1001_socket/server.py
```
