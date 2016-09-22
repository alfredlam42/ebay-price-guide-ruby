class ResultController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def index()
  end

  def create()
    result = Result.create(result: params[:result].to_json, searchParams: params[:searchParams], user_id: current_user.id);
    render plain: 'done'
  end
end
