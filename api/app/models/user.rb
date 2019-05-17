class User < ApplicationRecord
  has_secure_password

  has_many :providers, dependent: :destroy

  validates :password, length: { minimum: 6 }, presence: true, confirmation: true
  validates :email, uniqueness: true, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i }

  def self.find_or_create_user_with_provider(auth)
    return if auth.blank?

    password = SecureRandom.base64(12)

    user = User.create_with(
      password: password,
      password_confirmation: password
    ).find_or_create_by(email: auth[:info][:email])

    user.providers.find_or_create_by(name: auth[:provider], uid: auth[:uid])

    user
  end
end
