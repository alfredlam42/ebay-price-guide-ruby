Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :search, only: [:index, :create]
  resources :result, only: [:create]

  root 'search#index'
end
