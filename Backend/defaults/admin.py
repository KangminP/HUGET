from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import *
# Register your models here.
admin.site.register(DefaultUser)
admin.site.register(Rest)
admin.site.register(RestMenu)
admin.site.register(ExFood)
admin.site.register(TopItem)
admin.site.register(BrandShop)
admin.site.register(RestTheme)
