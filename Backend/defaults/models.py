from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import validate_comma_separated_integer_list
# Create your models here.


class DefaultUser(AbstractUser):
    nickname = models.CharField(max_length=100)


class Rest(models.Model):
    rest_name = models.CharField(max_length=100, primary_key=True)
    rest_address = models.CharField(max_length=100)
    rest_high = models.CharField(max_length=100, null=True)
    rest_highdirect = models.CharField(max_length=100, null=True)
    rest_coordinate = models.CharField(max_length=100)
    rest_tel = models.CharField(max_length=100)
    rest_tmap = models.CharField(max_length=100)
    rest_fix = models.BooleanField(default=False)
    rest_truck = models.BooleanField(default=False)
    rest_feeding = models.BooleanField(default=False)
    rest_sleep = models.BooleanField(default=False)
    rest_shower = models.BooleanField(default=False)
    rest_drug = models.BooleanField(default=False)
    rest_laundary = models.BooleanField(default=False)


class RestComment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    rest_name = models.ForeignKey(Rest, on_delete=models.CASCADE)
    comment_content = models.TextField()
    comment_create = models.DateTimeField(auto_now_add=True)
    comment_edit = models.DateTimeField(auto_now=True)


class RestMenu(models.Model):
    rest_name = models.ForeignKey(Rest, on_delete=models.CASCADE)
    menu_name = models.CharField(max_length=100)
    menu_price = models.CharField(max_length=100)
    menu_best = models.CharField(max_length=100)


class ExFood(models.Model):
    rest_name = models.ForeignKey(Rest, on_delete=models.CASCADE)
    ex_name = models.CharField(max_length=100)
    ex_price = models.CharField(max_length=100)
    ex_img = models.CharField(max_length=100)
    ex_info = models.CharField(max_length=100)


class BrandShop(models.Model):
    rest_name = models.ForeignKey(Rest, on_delete=models.CASCADE)
    brand_name = models.CharField(max_length=100, null=True)
    brand_opentime = models.CharField(max_length=100, null=True)
    brand_closetime = models.CharField(max_length=100, null=True)
    brand_info = models.CharField(max_length=100, null=True)


class TopItem(models.Model):
    rest_name = models.ForeignKey(Rest, on_delete=models.CASCADE)
    rank = models.IntegerField()
    top_shop = models.CharField(max_length=100)
    top_item = models.CharField(max_length=100)


class RestTheme(models.Model):
    rest_name = models.ForeignKey(Rest, on_delete=models.CASCADE)
    theme_name = models.CharField(max_length=100)
    theme_detail = models.CharField(max_length=100)


class RestGas(models.Model):
    rest_name = models.ForeignKey(Rest, on_delete=models.CASCADE)
    gas_name = models.CharField(max_length=100)
    gas_lpg = models.CharField(max_length=100, null=True)
    gas_tel = models.CharField(max_length=100, null=True)
