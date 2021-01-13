from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultUser
        fields = ['username', 'email', 'password', 'nickname']

    def create(self, validated_data):
        user = DefaultUser.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultUser
        fields = ['email', 'password', 'nickname']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DefaultUser
        fields = '__all__'


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        # print(data['username'])
        # print(data['password'])
        # user = authenticate(**data)
        user = authenticate(
            username=data['username'], password=data['password'])
        print(user)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Missing BurgerKing")


class RestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rest
        fields = '__all__'


class RestCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestComment
        fields = '__all__'


class RestMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestMenu
        fields = '__all__'


class ExFoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExFood
        fields = '__all__'


class BrandShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrandShop
        fields = '__all__'


class TopItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TopItem
        fields = '__all__'


class RestThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestTheme
        fields = '__all__'


class RestGasSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestGas
        fields = '__all__'
