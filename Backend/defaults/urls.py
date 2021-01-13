from django.contrib import admin
from django.conf.urls import url
from django.urls import path
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/register/', RegistrationAPI.as_view()),
    path('auth/login/', LoginAPI.as_view()),
    path('auth/user/', UserAPI.as_view()),
    path('auth/user/profile/', UserProfileAPI.as_view()),
    path('auth/rest/', RestAPI.as_view()),
    path('auth/rest/high/', RestHighAPI.as_view()),
    path('auth/rest/info/', RestInfoAPI.as_view()),
    path('auth/rest/brand/', BrandInfoAPI.as_view()),
    path('auth/rest/<str:rest_name>/comment/', RestCommentAPI.as_view()),
    path('auth/rest/<str:rest_name>/comment/<int:comment_pk>/',
         CommentDeleteAPI.as_view()),
    path('auth/comment/', UserCommentAPI.as_view()),
    path('comment/', CommentAPI.as_view()),
    path('auth/search/food/', SearchFoodAPI.as_view()),
    path('auth/search/foodhigh/', SearchFoodHighAPI.as_view()),

]
