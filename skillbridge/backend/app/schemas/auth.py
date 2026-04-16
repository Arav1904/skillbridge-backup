from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

# Keep these aliases so any existing imports still work
TokenResponse = Token
