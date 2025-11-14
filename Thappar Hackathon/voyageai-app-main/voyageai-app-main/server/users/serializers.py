from __future__ import annotations

from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    avatarUrl = serializers.CharField(source="avatar_url", allow_blank=True, allow_null=True)

    class Meta:
        model = User
        fields = ("id", "email", "name", "avatarUrl", "bio", "preferences", "role")


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    preferences = serializers.JSONField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = ("email", "password", "name", "preferences")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        if email and password:
            # Try authenticating with email as username (since USERNAME_FIELD = 'email')
            user = authenticate(request=self.context.get("request"), username=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid credentials", code="authorization")
        else:
            raise serializers.ValidationError("Email and password are required", code="authorization")
        attrs["user"] = user
        return attrs

