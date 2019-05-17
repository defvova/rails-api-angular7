# frozen_string_literal: true

class Api::V1::BaseController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, with: :not_found!

  before_action :authenticate!

  def assign_jwt_cookies(user, access_token = nil)
    return unless user

    token = Jwt::GenerationService.new(user_id: user.id, access_token: access_token).token
    time = 24.hours.from_now
    cookies.signed[:jwt] = { value: token, expires: time, httponly: true }
  end

  def current_user
    return @current_user = nil unless decoded
    @current_user ||= User.find(decoded['sub']['user_id'])
  end

  def current_access_token
    return unless decoded
    decoded['sub']['access_token']
  end

  private

  def decoded
    Jwt::DecodingService.new(cookies.signed[:jwt]).decrypt!
  end

  def authenticate!
    unauthorized! unless current_user
  end

  def unauthorized!
    head(:unauthorized)
  end

  def not_found!
    head(:not_found)
  end
end

