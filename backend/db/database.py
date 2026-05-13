import os
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy import inspect, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./marketradar.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    pass


def init_db() -> None:
    from backend.db import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    add_missing_sqlite_columns()


def add_missing_sqlite_columns() -> None:
    if not DATABASE_URL.startswith("sqlite"):
        return
    inspector = inspect(engine)
    table_columns = {
        table: {column["name"] for column in inspector.get_columns(table)}
        for table in ("watchlists", "listings")
        if table in inspector.get_table_names()
    }
    additions = {
        "watchlists": {
            "category_id": "VARCHAR(80)",
            "category_name": "VARCHAR(120)",
            "craigslist_category": "VARCHAR(20)",
            "facebook_category": "VARCHAR(120)",
        },
        "listings": {
            "category_id": "VARCHAR(80)",
            "category_name": "VARCHAR(120)",
        },
    }
    with engine.begin() as connection:
        for table, columns in additions.items():
            existing = table_columns.get(table, set())
            for name, ddl in columns.items():
                if name not in existing:
                    connection.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {ddl}"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def session_scope():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
