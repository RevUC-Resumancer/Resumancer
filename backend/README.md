# Instructions

Get dependencies by running the following command on `/backend`:
```
pip install -r app/requirements.txt
```

Run the app with the following command on `/backend`:

```
python -m app.main
```
When running from a server from `/backend`:

```
gunicorn -w 4 -b 0.0.0.0:8000 app.main:create_app
```