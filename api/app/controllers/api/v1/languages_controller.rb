# frozen_string_literal: true

class Api::V1::LanguagesController < Api::V1::BaseController
  def index
    @http ||= HTTP.get('https://github-trending-api.now.sh/languages')
    render json: LanguageSerializer.new(@http.parse)
  end
end
