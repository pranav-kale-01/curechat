from django.contrib import admin
from django.urls import path
from backend_logic import get_response_from_bot
from .views import chatbot

urlpatterns = [
    path('', chatbot, name="home" ),
    path("curechat/", get_response_from_bot ),
    path('admin/', admin.site.urls),
]
