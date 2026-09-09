import hashlib
import hmac
import os
from datetime import datetime, timezone, timedelta
from typing import Optional, Union, Any

try:
    import jwt
    JWTError = getattr(jwt, "PyJWTError", Exception)
except ImportError:
    from jose import jwt
    JWTError = getattr(jwt, "JWTError", Exception)

from app.config import settings

# Salted sha256 password hashing for guaranteed cross-platform compatibility
def get_password_hash(password: str) -> str:
    salt = os.urandom(16).hex()
    pwd_hash = hashlib.sha256((salt + password).encode('utf-8')).hexdigest()
    return f"{salt}${pwd_hash}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        if "$" not in hashed_password:
            # Fallback for plain or simple legacy hashes
            return plain_password == hashed_password
        salt, pwd_hash = hashed_password.split("$", 1)
        test_hash = hashlib.sha256((salt + plain_password).encode('utf-8')).hexdigest()
        return hmac.compare_digest(test_hash, pwd_hash)
    except Exception:
        return False

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        return None
