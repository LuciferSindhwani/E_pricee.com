from __future__ import annotations

try:
    import pymysql

    pymysql.install_as_MySQLdb()
except ImportError:
    pass


