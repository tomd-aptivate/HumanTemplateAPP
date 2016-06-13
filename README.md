Developer guide
===============


# Initial setup

$ bower install


# Development server

$ cd app
$ python -m SimpleHTTPServer 8000


## Work around CORS header issue

pip install mitmproxy

$ mitmproxy -R https://datastoreapi.azurewebsites.net/ -p 1234 --setheader :~q:Host:datastoreapi.azurewebsites.net --setheader :~s:Access-Control-Allow-Origin:'*'

