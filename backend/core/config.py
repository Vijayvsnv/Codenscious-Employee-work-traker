from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    GEMINI_API_KEY: str 

    OPENAI_API_KEY: str
    ADMIN_ID: str       
    ADMIN_PASSWORD: str  

    class Config:
        env_file = ".env"

settings = Settings()

OPENAI_API_KEY: str