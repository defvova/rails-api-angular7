# frozen_string_literal: true

class Api::V1::TrendingsController < Api::V1::BaseController
  def index
    par = "language=#{params[:lang]}&since=#{params[:since].presence || 'daily'}"
    http = HTTP.get("https://github-trending-api.now.sh/repositories?#{par}")
    render json: TrendingSerializer.new(http.parse)
  end
end
