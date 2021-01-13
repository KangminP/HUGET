from django.shortcuts import render
from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .models import *
from .serializers import *
from knox.models import AuthToken
from rest_framework.generics import *
from django.http import HttpResponse, JsonResponse
import json
from django.core import serializers

import numpy as np
from collections import Counter
from itertools import chain
import random

# Create your views here.


# 회원가입
class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )

# 로그인


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

# 사용자 프로필


class UserProfileAPI(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(self.object, data=request.data)

        if serializer.is_valid():
            serializer.save()
            self.object.set_password(serializer.data.get("password"))
            self.object.save()

            response = {
                "user": UserSerializer(
                    self.object, context=self.get_serializer_context()
                ).data,
            }

            return Response(response)
        return Response('gang')

# 휴게소


class RestAPI(generics.ListAPIView):
    serializer_class = RestSerializer

    def get_queryset(self):
        rests = Rest.objects.all()
        print(rests)
        return rests

# 고속도로이름 및 방향(딱히 쓰이진 않음)


class RestHighAPI(generics.ListAPIView):
    serializer_class = RestSerializer

    def get_queryset(self):
        rests = Rest.objects.all()

    def post(self, request):
        highway = request.data["rest_high"]
        direction = request.data["rest_highdirect"]
        high_rest = Rest.objects.filter(
            rest_high=highway, rest_highdirect=direction).values()
        return Response(high_rest)

# 휴게소와 관련된 정보들 제공


class RestInfoAPI(generics.ListAPIView):
    serializer_class = RestSerializer

    def get_queryset(self):
        rests = Rest.objects.values("rest_name")

    def post(self, request):
        total = []
        name = request.data["rest_name"]
        x = Rest.objects.filter(rest_name=name).values()

        a = RestMenu.objects.filter(rest_name=name).values(
            "menu_name", "menu_price", "menu_best")
        b = ExFood.objects.filter(rest_name=name).values()
        c = TopItem.objects.filter(rest_name=name).values(
            "rank", "top_item", "top_shop")
        d = RestTheme.objects.filter(rest_name=name).values(
            "theme_name", "theme_detail")
        e = RestGas.objects.filter(rest_name=name).values(
            "gas_name", "gas_lpg", "gas_tel")
        total = {"rest": x, "food": a, "EX": b, "TOP": c, "THEME": d, "GAS": e}
        print('check')
        print(total)
        return Response(total)

# 휴게소 별 브랜드 제공


class BrandInfoAPI(generics.ListAPIView):
    serializer_class = BrandShopSerializer

    def get_queryset(self):
        rests = BrandShop.objects.all()

    def post(self, request):
        name = request.data["rest_name"]
        brandshop = BrandShop.objects.filter(rest_name=name).values()
        return Response(brandshop)

# 댓글 가져오기


class RestCommentAPI(generics.ListAPIView):
    serializer_class = RestCommentSerializer

    def get_object(self, rest_name):
        return Rest.objects.get(rest_name=rest_name)

    def get(self, request, rest_name):
        rest_name = self.get_object(rest_name)
        comments = RestComment.objects.filter(rest_name=rest_name)
        serializer = RestCommentSerializer(comments, many=True)
        print(serializer.data)
        commentcontents = []
        for reco in serializer.data:
            data = {
                'id': reco['id'],
                'comment_content': reco['comment_content'],
                'comment_create': reco['comment_create'],
                'comment_edit': reco['comment_edit'],
                'user': DefaultUser.objects.get(id=reco['user']).username,
                'nickname': DefaultUser.objects.get(id=reco['user']).nickname,
                'rest_name': reco['rest_name'],
            }
            commentcontents.append(data)
        return Response(commentcontents)

# 사용자 댓글모음?


class UserCommentAPI(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RestCommentSerializer

    def get_object(self):
        return self.request.user

    def get_queryset(self):
        user_comments = RestComment.objects.all().filter(user=self.get_object().id)
        return user_comments

# 댓글 삭제


class CommentDeleteAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RestCommentSerializer

    def get_object(self):
        return self.request.user

    def delete(self, request, rest_name, comment_pk):
        RestComment.objects.filter(
            id=comment_pk, user=self.get_object()).delete()
        return Response('CommentDelete')


# 댓글작성
class CommentAPI(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RestCommentSerializer

    def get_object(self):
        return self.request.user

    # 댓글입력
    def post(self, request):
        data = request.data
        rest_name = Rest.objects.get(rest_name=str(
            request.data['rest_name']))
        comment = RestComment(
            user=self.get_object(),
            rest_name=rest_name,
            comment_content=request.data['comment_content'],
        )
        comment.save()
        return Response('CommentSave1')

    # 댓글수정

    def put(self, request):
        data = request.data
        comment = RestComment.objects.filter(
            rest_name=request.data['rest_name'], user=self.get_object(), pk=request.data["id"])
        comment.update(
            comment_content=request.data['comment_content'],
        )
        return Response('CommentSave2')

# 음식검색


class SearchFoodAPI(generics.ListAPIView):
    serializer_class = RestSerializer

    def get_queryset(self):
        rests = Rest.objects.values("rest_name")

    def post(self, request):
        total = []
        menu = request.data["rest_menu"]
        x = RestMenu.objects.filter(
            menu_name__contains=menu).values("rest_name")
        print(x)
        x = x.union(x)
        print(x)
        print('----------')
        for name in x:
            y = name['rest_name']
            z = Rest.objects.filter(rest_name=y).values(
                "rest_name", "rest_high", "rest_highdirect", "rest_coordinate"
            )
            r = RestMenu.objects.filter(
                rest_name=y, menu_name__contains=menu).values(
                    "menu_name", "menu_price", "menu_best"
            )
            for i in r:
                print(f'{z[0]} {i}')
                q = dict(z[0], **i)
                total.append(q)
        print('check')
        return Response(total)


# 음식 + 도로검색
class SearchFoodHighAPI(generics.ListAPIView):
    serializer_class = RestSerializer

    def get_queryset(self):
        rests = Rest.objects.values("rest_name")

    def post(self, request):
        total = []
        menu = request.data["rest_menu"]
        highway = request.data["highway"]

        x = RestMenu.objects.filter(
            menu_name__contains=menu).values("rest_name")
        print(x)
        tmp = []
        for name in x:
            restname = name['rest_name']
            if restname not in tmp:
                tmp.append(restname)
        for y in tmp:
            t = Rest.objects.filter(
                rest_name=y, rest_high=highway).values('rest_high')

            if t:
                z = Rest.objects.filter(rest_name=y, rest_high=highway).values(
                    "rest_name", "rest_high", "rest_highdirect", "rest_coordinate"
                )
                r = RestMenu.objects.filter(
                    rest_name=y, menu_name__contains=menu).values(
                        "menu_name", "menu_price", "menu_best"
                )
                for i in r:
                    print(f'{z[0]} {i}')
                    q = dict(z[0], **i)
                    total.append(q)
            else:
                pass
        print('check')
        return Response(total)
