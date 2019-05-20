# frozen_string_literal: true

class Api::V1::UsersController < Api::V1::BaseController
  skip_before_action :authenticate!, only: :create

  def create
    user = User.new(create_user_params)
    return head :ok if user.save

    render json: { errors: user.errors.messages }
  end

  def update
    if current_user.update_attributes(update_user_params)
      head :ok
    else
      render json: { errors: current_user.errors.messages }
    end
  end

  private

  def create_user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end

  def update_user_params
    params.require(:user).permit(:email, :first_name, :last_name)
  end
end
