"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.http import HttpResponseRedirect
from game.views import RoomViewSet, RoomPlayerViewSet, GameViewSet, WordViewSet, WordPoolViewSet, RoomWordViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'roomplayers', RoomPlayerViewSet)
router.register(r'games', GameViewSet)
router.register(r'words', WordViewSet)
router.register(r'wordpool', WordPoolViewSet)
router.register(r'roomwords', RoomWordViewSet, basename='roomword')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path("", lambda request: HttpResponseRedirect("/api/")),  # 👈 yönlendirme
]
