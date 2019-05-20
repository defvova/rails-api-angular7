# frozen_string_literal: true

class Api::V1::PasswordsController < Api::V1::BaseController
  def update
    user = User.find(current_user.id)
    if user.authenticate(params[:user][:current_password])
      if user.update_attributes(user_params)
        head :ok
      else
        render json: { errors: user.errors.messages }
      end
    else
      render json: { errors: { current_password: ['is invalid'] }}
    end
  end

  private

  def user_params
    params.require(:user).permit(:password, :password_confirmation)
  end
end
