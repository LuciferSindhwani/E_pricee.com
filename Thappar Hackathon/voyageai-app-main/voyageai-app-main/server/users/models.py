from __future__ import annotations

import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom user model that keeps Django's username field for compatibility
    while adding project-specific metadata required by the frontend.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150)
    avatar_url = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    preferences = models.JSONField(blank=True, null=True)
    role = models.CharField(max_length=32, default="user")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = ["name"]

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.email

