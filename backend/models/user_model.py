from sqlalchemy import Column, Integer, String
from db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    emp_id = Column(String, unique=True)
    name = Column(String)
    email = Column(String)