#!/bin/bash

# Function to create a JWT token
create_jwt_token() {
  local secret="$1"

  # Base64 encode function
  base64_encode() {
    echo -n "$1" | base64 | tr -d '\n'
  }

  # JWT header and payload
  header='{"alg":"HS256","typ":"JWT"}'
  payload='{"sub":"user123","exp":1672531200}'

  # Base64 encode header and payload
  base64_header=$(base64_encode "$header")
  base64_payload=$(base64_encode "$payload")

  # Combine header and payload with a dot
  header_payload="${base64_header}.${base64_payload}"

  # HMAC-SHA256 signature using the provided secret
  signature=$(echo -n "$header_payload" | openssl dgst -binary -sha256 -hmac "$secret" | base64 | 
tr -d '\n')

  # Combine the header, payload, and signature with dots to form the JWT token
  jwt_token="${header_payload}.${signature}"

  echo "JWT Token: $jwt_token"
}

# Check if the secret is provided as an argument
if [ $# -eq 0 ]; then
  echo "Usage: $0 <secret>"
  exit 1
fi

# Call the function with the provided secret
create_jwt_token "$1"

