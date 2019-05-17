# frozen_string_literal: true

class Jwt::DecodingService
  SIGNING_ALGORITHM = 'HS256'

  def initialize(token)
    @token = token
  end

  def decrypt!
    return if @token.blank?
    JWT.decode(@token, secret).first
  end

  private

  def secret
    Rails.application.secrets.secret_key_base
  end
end
