class UserController < ApplicationController
  def create()

  end

  private
    def user_params
      params.require(:user).permit(:name, :password)
    end
end
