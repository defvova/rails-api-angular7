Rails.application.routes.draw do
  get '/auth/:provider/callback', to: 'api/v1/sessions#create'

  get '/', to: redirect('http://localhost:4200'), as: :front_root
  get '/', to: redirect('http://localhost:4200/success'), as: :success_front_root

  namespace :api do
    namespace :v1 do
      resources :users, only: %i[create update]
      resource :sessions, only: %i[new destroy create]
      resources :trendings, only: :index
      resources :languages, only: :index
      resources :passwords, only: :update
    end
  end
end
