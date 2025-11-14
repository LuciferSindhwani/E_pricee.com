from __future__ import annotations

import os
from datetime import timedelta
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "hackathon-secret-key")
DEBUG = os.getenv("DEBUG", "true").lower() in {"1", "true", "yes", "on"}

default_hosts = ["localhost", "127.0.0.1", "[::1]"]
ALLOWED_HOSTS = [host.strip() for host in os.getenv("ALLOWED_HOSTS", ",".join(default_hosts)).split(",") if host.strip()]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "users",
    "trips",
    "integrations",
    "posts",
    "profile_api",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "voyage_backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "voyage_backend.wsgi.application"
ASGI_APPLICATION = "voyage_backend.asgi.application"


def build_database_config() -> dict[str, object]:
    url = os.getenv("DATABASE_URL")
    if url:
        parsed = urlparse(url)
        if parsed.scheme not in {"mysql", "mariadb"}:
            raise ValueError("DATABASE_URL must use mysql:// or mariadb://")
        return {
            "ENGINE": "django.db.backends.mysql",
            "NAME": parsed.path.lstrip("/") or "",
            "USER": parsed.username or "",
            "PASSWORD": parsed.password or "",
            "HOST": parsed.hostname or "127.0.0.1",
            "PORT": parsed.port or 3306,
            "OPTIONS": {"charset": "utf8mb4"},
        }
    return {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }


DATABASES = {"default": build_database_config()}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=12),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
]

CSRF_TRUSTED_ORIGINS = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
]

AUTH_USER_MODEL = "users.User"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Disable trailing slash redirect for API endpoints
APPEND_SLASH = False

