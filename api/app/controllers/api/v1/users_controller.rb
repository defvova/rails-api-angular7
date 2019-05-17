# frozen_string_literal: true

class Api::V1::UsersController < Api::V1::BaseController
  skip_before_action :authenticate!, only: :create

  def create
    user = User.new(create_user_params)
    return head :ok if user.save

    render json: { errors: user.errors.messages }
  end

  private

  def create_user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
