from datetime import date, datetime

from sqlalchemy import Date, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Bin(Base):
    __tablename__ = "bins"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    colour: Mapped[str] = mapped_column(String(7), nullable=False)
    icon: Mapped[str] = mapped_column(String(20), nullable=False)
    schedule: Mapped[str] = mapped_column(String(10), nullable=False)
    # Collection date the bin was put out for; stops counting once that collection has passed
    put_out_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


class BinSettings(Base):
    __tablename__ = "bin_settings"

    id: Mapped[int] = mapped_column(primary_key=True)
    collection_weekday: Mapped[int] = mapped_column(Integer, nullable=False)
    week_a_date: Mapped[date] = mapped_column(Date, nullable=False)
